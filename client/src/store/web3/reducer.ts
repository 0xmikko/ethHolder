import { Web3Actions, Web3Error, Web3Status } from "./index";

import { BigNumberish, providers, Signer } from "ethers";
import { ETHodlerNft, Minter } from "../../../../typechain";

export interface Web3State {
  provider?: providers.Web3Provider;
  account?: string;
  balance?: BigNumberish;
  signer?: Signer;
  chainId?: number;
  minter?: Minter;
  token?: ETHodlerNft;

  status: Web3Status;
  error?: Web3Error;
}

const initialState: Web3State = {
  status: "WEB3_STARTUP",
};

export function web3Reducer(
  state: Web3State = initialState,
  action: Web3Actions
): Web3State {
  switch (action.type) {
    case "WEB3_RESET":
      return {
        ...state,
        provider: undefined,
        account: undefined,
        balance: undefined,
        signer: undefined,
        chainId: undefined,
        status: "WEB3_STARTUP",
        error: undefined,
      };

    case "WEB3_INIT":
      return {
        ...state,
        status: "WEB3_STARTUP",
        error: "NO_ERROR",
      };
    case "WEB3_CONNECTED":
      return {
        ...state,
        ...action.payload,
        status: "WEB3_CONNECTED",
      };

    case "WEB3_FAILED":
      return {
        ...state,
        account: undefined,
        signer: undefined,
        status: "NO_WEB3",
        error: action.payload.error,
        chainId: action.payload.chainId,
      };
  }

  return state;
}
