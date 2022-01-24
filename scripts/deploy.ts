/* eslint-disable camelcase */
import { ethers } from "hardhat";
import { Minter__factory } from "../typechain";
import { parseAccounts } from "../merkle/parse-accounts";
import * as fs from "fs";
import { imagesURL } from "../core/images";

export const CHAINLINK_ORACLE = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
export const WETH_TOKEN = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
export const STETH_TOKEN = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84";
export const PRIORITY_TILL = 1643207675;

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

  // PREPARING MERKLE TREE
  const gearHodlers = fs.readFileSync("gearHolders.txt").toString();
  const lobsHodlers = fs.readFileSync("lobsterHolders.txt").toString();

  const result: Record<string, boolean> = {};
  gearHodlers
    .split("\n")
    .filter((e) => e !== "")
    .forEach((element) => {
      result[element.toLowerCase()] = true;
    });

  lobsHodlers
    .split("\n")
    .filter((e) => e !== "")
    .forEach((element) => {
      result[element.toLowerCase()] = true;
    });

  const merkle = parseAccounts(Object.keys(result));

  fs.writeFileSync("./client/src/merkle.json", JSON.stringify(merkle));

  // CONTRACTS DEPLOYMENT
  const nft = await ETHodlerNft.deploy(
    CHAINLINK_ORACLE,
    imagesURL,
    merkle.merkleRoot,
    WETH_TOKEN,
    STETH_TOKEN,
    PRIORITY_TILL
  );
  await nft.deployed();
  const receipt = await nft.deployTransaction.wait();

  console.log("Minter deployed to:", nft.address);
  console.log("Gas used:", receipt.gasUsed.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
