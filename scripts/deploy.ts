/* eslint-disable camelcase */
import { ETHodlerNft } from "./../typechain/ETHodlerNft.d";
import { ethers } from "hardhat";
import { ETHodlerNft__factory } from "../typechain/factories/ETHodlerNft__factory";
import { Minter__factory } from "../typechain";
import { parseAccounts } from "../merkle/parse-accounts";
import * as fs from "fs";

export const ipfsPictures = [
  {
    path: "toTheMoon.png",
    hash: "QmdLnmga6bno3TMh8WUENjqbph96XAUaWiP3ydpKv9Nfac",
    size: 155254,
  },
  {
    path: "bullish.png",
    hash: "QmSk4mFjmXdBLkJFUmmCpGhFrkhfRRujTgNwmv3zeJY94J",
    size: 139269,
  },
  {
    path: "stable.png",
    hash: "QmWTjPHjJsEce18xYYzfSKjmz2YWeSDspNUjnTq8DsGoYF",
    size: 63542,
  },
  {
    path: "panic.png",
    hash: "QmTVmzkCLemQ2ERVgLC1y9wrNqdtJ44yLewLNFak1sPsBg",
    size: 96553,
  },

  {
    path: "applyingToMcDonalds.png",
    hash: "QmS1jTRwAV7PENAorRzMEKz6pPhGbWix2zLuRRvAjQcMHN",
    size: 80308,
  },
];

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const ETHodlerNft = (await ethers.getContractFactory(
    "Minter"
  )) as unknown as Minter__factory;

  const images = ipfsPictures.map(
    (ipfs) => `https://ipfs.io/ipfs/${ipfs.hash}/`
  );

  const gearHodlers = fs.readFileSync("gearHolders.txt").toString();
  const lobsHodlers = fs.readFileSync("lobsterHolders.txt").toString();

  const result: Record<string, boolean> = {};
  gearHodlers.split("\n").forEach((element) => {
    result[element.toLowerCase()] = true;
  });

  lobsHodlers.split("\n").forEach((element) => {
    result[element.toLowerCase()] = true;
  });

  console.log(Object.keys(result));

  const merkle = parseAccounts(Object.keys(result));

  console.log(images);
  const nft = await ETHodlerNft.deploy(images, merkle.merkleRoot);
  await nft.deployed();

  console.log("Minter deployed to:", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
