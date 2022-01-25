// @ts-ignore
import { ethers } from "hardhat";
import { expect } from "../utils/expect";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import {
  ChainlinkPriceFeedMock,
  ChainlinkPriceFeedMock__factory,
  ETHodlerNft,
  ETHodlerNft__factory,
  Minter,
  Minter__factory,
  TokenMock__factory,
} from "../typechain";
import { MerkleDistributorInfo, parseAccounts } from "../merkle/parse-accounts";
import { imagesURL } from "../core/images";
import { Mood } from "../core/mood";
import { BigNumber } from "ethers";

const PERCENTAGE_FACTOR = 10000;
const DEADLINE = Math.floor(Date.now() / 1000 + 1000);
const WAD = BigNumber.from(10).pow(18);

describe("ETHHodler NFT", function () {
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;
  let user2: SignerWithAddress;
  let chainlinkPriceFeedMock: ChainlinkPriceFeedMock;
  let minter: Minter;
  let nft: ETHodlerNft;
  let merkle: MerkleDistributorInfo;

  beforeEach(async function () {
    deployer = (await ethers.getSigners())[0];
    user = (await ethers.getSigners())[1];
    user2 = (await ethers.getSigners())[2];

    const accounts = [user.address, user2.address];

    merkle = parseAccounts(accounts);

    const wethFactory = (await ethers.getContractFactory(
      "TokenMock"
      // eslint-disable-next-line camelcase
    )) as unknown as TokenMock__factory;

    const weth = await wethFactory.deploy("ETH", "weth");

    const pricefeedFactory = (await ethers.getContractFactory(
      "ChainlinkPriceFeedMock"
      // eslint-disable-next-line camelcase
    )) as unknown as ChainlinkPriceFeedMock__factory;

    chainlinkPriceFeedMock = await pricefeedFactory.deploy(2000e8, 8);

    const tokenFactory = (await ethers.getContractFactory(
      "ETHodlerNft"
      // eslint-disable-next-line camelcase
    )) as unknown as ETHodlerNft__factory;

    nft = await tokenFactory.deploy(chainlinkPriceFeedMock.address, imagesURL);
    await nft.deployed();

    const minterFactory = (await ethers.getContractFactory(
      "Minter"
      // eslint-disable-next-line camelcase
    )) as unknown as Minter__factory;

    minter = await minterFactory.deploy(
      chainlinkPriceFeedMock.address,
      nft.address,
      merkle.merkleRoot,
      weth.address,
      weth.address,
      DEADLINE
    );
    await minter.deployed();

    await nft.transferOwnership(minter.address);
  });

  it("Minter claim reverts till PRIORITY DEADLINE", async function () {
    const revertMsg = "CMP";
    await expect(minter.claim()).to.be.revertedWith(revertMsg);
  });

  it("Minter claim works after PRIORITY DEADLINE", async function () {
    // @ts-ignore
    await deployer.provider.send("evm_mine", [DEADLINE + 1]);

    expect(await minter.totalSupply(), "totalSupply before").to.be.eq(0);
    expect(await nft.balanceOf(deployer.address), "balance before").to.be.eq(0);
    await minter.claim();
    expect(await minter.totalSupply(), "totalSupply after").to.be.eq(1);
    expect(await nft.balanceOf(deployer.address), "balance after").to.be.eq(1);
  });

  it("Minter claim reverts if user has < 1ETH", async function () {
    const revertMsg = "NEB";

    await user.sendTransaction({
      to: deployer.address,
      value: (await user.getBalance()).sub(WAD.div(2)),
    });
    await expect(minter.connect(user).claim()).to.be.revertedWith(revertMsg);

    await deployer.sendTransaction({
      to: user.address,
      value: WAD.mul(200),
    });
  });

  it("claimPriority reverts if called 2 times per one account", async function () {
    const revertMsg = "TAM";
    const claim = merkle.claims[user.address];

    await minter
      .connect(user)
      .claimMerkle(claim.index, claim.salt, claim.proof);

    await expect(
      minter.connect(user).claimMerkle(claim.index, claim.salt, claim.proof)
    ).to.be.revertedWith(revertMsg);
  });

  it("Minter claim reverts totalSupply > ETH Price", async function () {
    const revertMsg = "ATM";
    await chainlinkPriceFeedMock.setPrice(1e8);
    await minter.claim();
    await expect(minter.claim()).to.be.revertedWith(revertMsg);
  });

  it("priceDiff works correctly", async function () {
    const claim = merkle.claims[user.address];

    await minter
      .connect(user)
      .claimMerkle(claim.index, claim.salt, claim.proof);

    await chainlinkPriceFeedMock.setOldPrice(1000e8);
    expect(await nft.getMarketMood()).to.be.eq(Mood.TO_THE_MOON);
    expect(await nft.getPriceChange()).to.be.eq(PERCENTAGE_FACTOR);
    expect(await nft.tokenURI(0)).to.be.eq(imagesURL[0]);

    await chainlinkPriceFeedMock.setPrice(1031e8);
    expect(await nft.getPriceChange()).to.be.eq(310);
    expect(await nft.getMarketMood()).to.be.eq(Mood.BULLISH);
    expect(await nft.tokenURI(0)).to.be.eq(imagesURL[1]);

    await chainlinkPriceFeedMock.setPrice(1000e8);
    expect(await nft.getPriceChange()).to.be.eq(0);
    expect(await nft.getMarketMood()).to.be.eq(Mood.STABLE);
    expect(await nft.tokenURI(0)).to.be.eq(imagesURL[2]);

    await chainlinkPriceFeedMock.setPrice(900e8);
    expect(await nft.getPriceChange()).to.be.eq(-1000);
    expect(await nft.getMarketMood()).to.be.eq(Mood.PANIC);
    expect(await nft.tokenURI(0)).to.be.eq(imagesURL[3]);

    await chainlinkPriceFeedMock.setPrice(500e8);
    expect(await nft.getPriceChange()).to.be.eq(-5000);
    expect(await nft.getMarketMood()).to.be.eq(Mood.APPLYING_TO_MC_DONALDS);
    expect(await nft.tokenURI(0)).to.be.eq(imagesURL[4]);
  });

  it("customize reverts if called non-owner or twice", async function () {
    const claim = merkle.claims[user.address];

    await minter
      .connect(user)
      .claimMerkle(claim.index, claim.salt, claim.proof);

    await nft.connect(user).customize(0, "1", "2", "3", "4", "5");

    await expect(nft.customize(0, "1", "2", "3", "4", "5")).to.be.revertedWith(
      "OCC"
    );

    await expect(
      nft.connect(user).customize(0, "1", "2", "3", "4", "5")
    ).to.be.revertedWith("TAC");
  });
});
