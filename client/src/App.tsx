import React, { useEffect } from "react";
import { Link, MainDiv, Screen } from "./styles";
import { Token } from "./components/Token";
import { MagicButton } from "./components/MagicButton";
import { useDispatch } from "react-redux";
import actions from "./store/actions";
import {VideoButton} from "./components/Video";

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
          <VideoButton />
      </MainDiv>
      <div
        style={{
          color: "white",
          justifyContent: "space-between",
          display: "flex",
          flexDirection: "row",
          width: "100%",
          padding: "30px",
        }}
      >
        <div>
          Made with fun by
          <Link href={"https://twitter.com/mikaellazarev"} target={"_blank"}>
            Mikael
          </Link>
          in 20 hrs. No security audits passed.
        </div>
        <div>
          <Link href={"https://twitter.com/mikaellazarev"} target={"_blank"}>
            Etherscan
          </Link>

          <Link
            href={"https://github.com/MikaelLazarev/ethHolder"}
            target={"_blank"}
          >
            Github
          </Link>

          <Link href={"https://twitter.com/mikaellazarev"} target={"_blank"}>
            Opensea
          </Link>
        </div>
      </div>
    </Screen>
  );
}
