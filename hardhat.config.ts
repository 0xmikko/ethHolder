import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const MAINNET_PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.10",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      timeout: 0,
      accounts: [MAINNET_PRIVATE_KEY],
    },
    mainnet: {
      url: process.env.ETH_MAINNET_PROVIDER,
      accounts: [MAINNET_PRIVATE_KEY],
      chainId: 1,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
