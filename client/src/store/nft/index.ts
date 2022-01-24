import { RootState } from "../index";
import { ThunkAction } from "redux-thunk";
import { Mood } from "../../core/mood";
import {ClaimStatus, MintingStatus} from "../../core/merkle";

export type NFTActions =
  | {
      type: "MOOD_SUCCESS";
      payload: { mood: Mood; price: number; diff: number, totalSupply: number };
    }
  | {
      type: "CLAIM_STATUS";
      payload: ClaimStatus | undefined;
    }
    | {
    type: "MINTING_STATUS";
    payload: MintingStatus;
}

export type ThunkNFTAction = ThunkAction<void, RootState, unknown, NFTActions>;

export const nftSelector = (state: RootState) => state.nft;
