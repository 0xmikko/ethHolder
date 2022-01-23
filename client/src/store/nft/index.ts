import { RootState } from "../index";
import { ThunkAction } from "redux-thunk";
import { Mood } from "../../core/mood";

export type NFTActions = {
  type: "MOOD_SUCCESS";
  payload: Mood;
};

export type ThunkNFTAction = ThunkAction<void, RootState, unknown, NFTActions>;

export const moodSelector = (state: RootState) => state.nft.mood;
