/* eslint-disable camelcase */
import { ETHodlerNft } from "./../typechain/ETHodlerNft.d";
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { ETHodlerNft__factory } from "../typechain/factories/ETHodlerNft__factory";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const ETHodlerNft = (await ethers.getContractFactory(
    "ETHodlerNft"
  )) as unknown as ETHodlerNft__factory;
  const nft = await ETHodlerNft.deploy();

  await nft.deployed();

  console.log("Greeter deployed to:", nft.address);

  console.log(await nft.getPriceChange());
  console.log(await nft.getMarketMood());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
