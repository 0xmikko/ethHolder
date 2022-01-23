import { Mood } from "../../core/mood";
import { NFTActions } from "./index";
import { ClaimStatus } from "../../core/merkle";

export interface NFTState {
  mood: Mood | undefined;
  price: number | undefined;
  diff: number | undefined;
  claimStatus: ClaimStatus | undefined;
  totalSupply: number;
}

const initialState: NFTState = {
  mood: undefined,
  price: undefined,
  diff: undefined,
  claimStatus: undefined,
  totalSupply: 0,
};

export function nftReducer(
  state: NFTState = initialState,
  action: NFTActions
): NFTState {
  switch (action.type) {
    case "MOOD_SUCCESS":
      return {
        ...state,
        ...action.payload,
      };

    case "CLAIM_STATUS":
      return {
        ...state,
        claimStatus: action.payload,
      };
  }

  return state;
}
