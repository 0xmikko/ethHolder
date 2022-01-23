import { ethers } from "ethers";

import { ThunkWeb3Action } from "./index";
import { CHAIN_ID, MINTER_ADDRESS } from "../../config";
import {ETHodlerNft__factory, Minter, Minter__factory} from "../../typechain";

declare global {
  interface Window {
    ethereum: any;
  }
}

export interface MetamaskError {
  code: number;
  message: string;
  data: string;
}

export const connectWeb3 =
  (connectNew?: boolean): ThunkWeb3Action =>
  async (dispatch, getState) => {
    if (!window.ethereum) {
      dispatch({
        type: "WEB3_FAILED",
        payload: { error: "CONNECTION_ERROR" },
      });
      return;
    }

    try {
      const accounts = (await window.ethereum.request({
        method: connectNew ? "eth_requestAccounts" : "eth_accounts",
      })) as unknown as Array<string>;

      if ((!accounts || accounts.length === 0) && connectNew) {
        await window.ethereum.enable();
      }

      if (!accounts || accounts.length === 0) {
        dispatch({
          type: "WEB3_INIT",
        });
        return;
      }

      console.log("ACCOUNT TO CONNECT:", accounts);
    } catch (e) {
      console.log(e);
      if ((e as MetamaskError).code === 4001) {
        dispatch({ type: "WEB3_INIT" });
      } else {
        dispatch({
          type: "WEB3_FAILED",
          payload: { error: "CONNECTION_ERROR" },
        });
      }
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider.on("error", (tx) => {
        console.log("Web3 error");
      });
      const signer = provider.getSigner();

      const networkId = await provider.detectNetwork();

      if (networkId.chainId !== CHAIN_ID) {
        dispatch({
          type: "WEB3_FAILED",
          payload: { error: "WRONG_NETWORK_ERROR", chainId: networkId.chainId },
        });
        return;
      }

      const minter = Minter__factory.connect(MINTER_ADDRESS, signer) as Minter;

      const account = await signer.getAddress();

      dispatch({
        type: "WEB3_CONNECTED",
        payload: {
          provider,
          minter,
          account,
          signer,
          chainId: networkId.chainId,
        },
      });
    } catch (e) {
      console.log("WEB_FAILED:", e);
      dispatch({ type: "WEB3_FAILED", payload: { error: "CONNECTION_ERROR" } });
    }
  };

export const updateProvider =
  (
    provider:
      | ethers.providers.JsonRpcProvider
      | Promise<ethers.providers.Web3Provider>
  ): ThunkWeb3Action =>
  async (dispatch, getState) => {
    provider = await provider;
    const network = await provider.detectNetwork();

    if (network.chainId !== CHAIN_ID) {
      console.log("INCORRECT NETWORK");
      throw new Error("Incorrect network");
    }

    const minter = Minter__factory.connect(MINTER_ADDRESS, provider) as Minter;
    const token = await minter.token();

    const nft = ETHodlerNft__factory.connect(token, provider);

    dispatch({
      type: "WEB3_CONNECTED",
      payload: {
        provider,
        minter,
        nft
        chainId: networkId.chainId,
      },
    });

  };
