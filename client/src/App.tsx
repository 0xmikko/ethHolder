import React, {useEffect} from "react";
import {MainDiv, Screen} from "./styles";
import {Token} from "./components/Token";
import {MagicButton} from "./components/MagicButton";
import {useDispatch} from "react-redux";
import actions from "./store/actions";

export function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.web3.connectProvider());
  }, [dispatch]);

  return (
    <Screen>
      <MainDiv>
        <div
          style={{ fontSize: "120px", fontWeight: 700, marginBottom: "60px" }}
        >
          ETH HODLER
        </div>
        <Token />
        <MagicButton />
      </MainDiv>
    </Screen>
  );
}
