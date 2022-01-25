// @ts-ignore
import {ethers} from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import {ChainlinkPriceFeedMock, ETHodlerNft, Minter, Minter__factory,} from "../typechain";
import merkle from '../merkle.json'


describe("ETHHodler NFT", function () {
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;
  let user2: SignerWithAddress;

  let minter: Minter;
  let nft: ETHodlerNft;

  beforeEach(async function () {
    deployer = (await ethers.getSigners())[0];
    user = (await ethers.getSigners())[1];
    user2 = (await ethers.getSigners())[2];

    const account =

    minter = Minter__factory.connect(
      "0x4dc47d3833e9f296EAf68Aa1721d1A2AcC2fa18d",
      deployer
    );
  });

  it("Minter claim reverts till PRIORITY DEADLINE", async function () {

  });
});
