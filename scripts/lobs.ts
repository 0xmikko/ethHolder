import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ERC721__factory } from "../typechain/factories/ERC721__factory";
import * as fs from "fs";

const lobsterDAONft = "0x026224a2940bfe258d0dbe947919b62fe321f042";
const tokensQty = 3372;

async function getLobs() {
  const accounts = (await ethers.getSigners()) as Array<SignerWithAddress>;
  const deployer = accounts[0];
  const lobsterNft = ERC721__factory.connect(lobsterDAONft, deployer);
  const ownerMap: Record<string, boolean> = {};
  for (let i = 0; i < tokensQty; i++) {
    const owner = await lobsterNft.ownerOf(i);
    ownerMap[owner] = true;
  }

  const holders = Object.keys(ownerMap);
  fs.writeFileSync("lobserDAO.txt", holders.join("\n"));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
getLobs().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
