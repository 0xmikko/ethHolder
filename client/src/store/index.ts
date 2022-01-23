/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import { applyMiddleware, compose, createStore } from "redux";
import reducer from "./reducer";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

let composeEnhancers: typeof compose;

// if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
composeEnhancers = composeWithDevTools({});
// } else {
// composeEnhancers = compose;
// }

export type RootState = ReturnType<typeof reducer>;

export default function configureStore() {
  return createStore(reducer, composeEnhancers(applyMiddleware(thunk)), );
}
