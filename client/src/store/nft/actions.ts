import { ThunkNFTAction } from "./index";

export const getMood = (): ThunkNFTAction => async (dispatch, getState) => {
  const { token } = getState().web3;
  const mood = await token?.getMarketMood();
  dispatch({ type: "MOOD_SUCCESS", payload: mood! });
};
