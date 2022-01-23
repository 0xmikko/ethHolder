import {Mood} from "../../core/mood";
import {NFTActions} from "./index";

export interface NFTState {
mood: Mood | undefined
}

const initialState: NFTState = {
  mood: undefined

};

export function nftReducer(
  state: NFTState = initialState,
  action: NFTActions
): NFTState {
  switch (action.type) {
    case "MOOD_SUCCESS":
      return {
        ...state,
        mood: action.payload
      }
  }

  return state;
}
