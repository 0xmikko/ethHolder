/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import { combineReducers } from "redux";

import { nftReducer } from "./nft/reducer";
import { web3Reducer } from "./web3/reducer";

// eslint-disable-next-line import/no-anonymous-default-export
const reducer = combineReducers({
  nft: nftReducer,
  web3: web3Reducer,
});


export default reducer;
