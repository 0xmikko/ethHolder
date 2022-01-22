//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { AggregatorV3Interface } from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import { CHAINLINK_ORACLE, WAD, ETHodlerNft } from "./HodlerNft.sol";
import "hardhat/console.sol";

enum MintStage {
  PAUSED,
  BY_INVITATION,
  OPEN
}

address constant WETH_TOKEN = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
uint256 constant WAD = 1e18;

contract Minter {
  AggregatorV3Interface public immutable priceFeed;
  ETHodlerNft public token;
  uint256 public totalSupply;
  bytes32 public immutable merkleRoot;
  MintStage public stage;

  // This is a packed array of booleans.
  mapping(uint256 => uint256) private claimedBitMap;

  event Claimed(address indexed to, uint256 index);

  constructor(string[] memory defaultPictures, bytes32 _merkleRoot) {
    token = new ETHodlerNft(defaultPictures);
    priceFeed = AggregatorV3Interface(CHAINLINK_ORACLE);
    merkleRoot = _merkleRoot;
  }

  function claim() external {
    require(isClaimAllowed(), "ETH price is too low to mint new tokens");

    uint256 balance = IERC20(WETH_TOKEN).balanceOf(msg.sender) +
      address(msg.sender).balance;

    _mint(msg.sender);
  }

  function claimMerkle(
    uint256 index,
    uint256 salt,
    bytes32[] calldata merkleProof
  ) external {
    require(!isClaimed(index), "MerkleDistributor: Account is already mined.");

    address account = msg.sender;

    // Verify the merkle proof.
    bytes32 node = keccak256(abi.encodePacked(index, account, salt));
    require(
      merkleProof.length > 0 &&
        MerkleProof.verify(merkleProof, merkleRoot, node),
      "MerkleDistributor: Invalid proof."
    );

    // Mark it claimed and send the token.
    _setClaimed(index);
    _mint(account);
  }

  function isClaimAllowed() public returns (bool) {
    (, int256 price, , , ) = priceFeed.latestRoundData();
    return (uint256(price) / WAD) > totalSupply;
  }

  function isClaimed(uint256 index) public view returns (bool) {
    uint256 claimedWordIndex = index / 256;
    uint256 claimedBitIndex = index % 256;
    uint256 claimedWord = claimedBitMap[claimedWordIndex];
    uint256 mask = (1 << claimedBitIndex);
    return claimedWord & mask == mask;
  }

  function _setClaimed(uint256 index) private {
    uint256 claimedWordIndex = index / 256;
    uint256 claimedBitIndex = index % 256;
    claimedBitMap[claimedWordIndex] =
      claimedBitMap[claimedWordIndex] |
      (1 << claimedBitIndex);
  }

  function _mint(address account) internal {
    token.mint(account, totalSupply);
    emit Claimed(account, totalSupply);
    totalSupply++;
  }
}
