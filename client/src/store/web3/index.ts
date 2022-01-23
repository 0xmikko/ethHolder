import { RootState } from "../index";
import { ethers, Signer } from "ethers";
import { ThunkAction } from "redux-thunk";
import { ETHodlerNft, Minter } from "../../../../typechain";

export const web3Selector = (state: RootState) => state.web3;

export type Web3Status = "WEB3_STARTUP" | "WEB3_CONNECTED" | "NO_WEB3";

export type Web3Error = "NO_ERROR" | "CONNECTION_ERROR" | "WRONG_NETWORK_ERROR";

export type Web3Actions =
  | {
      type: "WEB3_RESET";
    }
  | {
      type: "WEB3_INIT";
    }
  | {
      type: "PROVIDER_CONNECTED";
      payload: {
        chainId: number;
        provider: ethers.providers.JsonRpcProvider;
        minter: Minter;
        token: ETHodlerNft;
      };
    }
  | {
      type: "WEB3_CONNECTED";
      payload: {
        account: string;
        signer: Signer;
      };
    }
  | {
      type: "WEB3_FAILED";
      payload: { error: Web3Error; chainId?: number };
    };

export type ThunkWeb3Action = ThunkAction<
  void,
  RootState,
  unknown,
  Web3Actions
>;
