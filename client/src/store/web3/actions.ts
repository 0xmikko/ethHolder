import { ethers } from "ethers";

import { ThunkWeb3Action } from "./index";
import { CHAIN_ID, JSON_RPC_PROVIDER, MINTER_ADDRESS } from "../../config";
import {
  AggregatorV3Interface__factory,
  ETHodlerNft__factory,
  Minter,
  Minter__factory,
} from "../../typechain";
import actions from "../actions";

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

      const { chainId } = await provider.detectNetwork();

      if (chainId !== CHAIN_ID) {
        dispatch({
          type: "WEB3_FAILED",
          payload: { error: "WRONG_NETWORK_ERROR", chainId },
        });
        return;
      }

      const account = await signer.getAddress();

      dispatch({
        type: "SIGNER_CONNECTED",
        payload: {
          account,
          signer,
        },
      });
    } catch (e) {
      console.log("WEB_FAILED:", e);
      dispatch({ type: "WEB3_FAILED", payload: { error: "CONNECTION_ERROR" } });
    }
  };

export const connectProvider =
  (): ThunkWeb3Action => async (dispatch, getState) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_PROVIDER);
      const network = await provider.detectNetwork();

      if (network.chainId !== CHAIN_ID) {
        throw new Error("Incorrect network");
      }

      const minter = Minter__factory.connect(
        MINTER_ADDRESS,
        provider
      ) as Minter;

      const token = await minter.token();

      const nft = ETHodlerNft__factory.connect(token, provider);

      dispatch({
        type: "PROVIDER_CONNECTED",
        payload: {
          provider,
          minter,
          token: nft,
          chainId: network.chainId,
        },
      });

      dispatch(actions.nft.nftState());
    } catch (e) {
      console.error(`Cant connect to JSON-RPC provider: ${JSON_RPC_PROVIDER}`);
      console.error(e);
    }
  };
