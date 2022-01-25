/* eslint-disable camelcase */
import { imagesURL } from "../core/images";

export const CHAINLINK_ORACLE = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
export const WETH_TOKEN = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
export const STETH_TOKEN = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84";
export const PRIORITY_TILL = 1643207675;

const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const TOKEN = "0x39FDb940Dd8aF09e62375e36A79F12a86b7B2aa5";
  const MINTER = "0x4dc47d3833e9f296EAf68Aa1721d1A2AcC2fa18d";
  const MERKLE_ROOT =
    "0x651bfa24114c9055eedfb2d3b6f2535294a8272cf6d4b9d422c21b100f88b37c";

  await hre.run("verify:verify", {
    address: TOKEN,
    constructorArguments: [CHAINLINK_ORACLE, imagesURL],
  });
  await hre.run("verify:verify", {
    address: MINTER,
    constructorArguments: [
      CHAINLINK_ORACLE,
      TOKEN,
      MERKLE_ROOT,
      WETH_TOKEN,
      STETH_TOKEN,
      PRIORITY_TILL,
    ],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
