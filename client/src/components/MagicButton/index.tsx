import React from "react";
import { useWeb3 } from "../../hooks/useWeb3";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";
import { Btn } from "./styles";
import {useClaimStatus, useNFT} from "../../hooks/useNFT";

export function MagicButton(): React.ReactElement {
  const { status, account, error } = useWeb3();
  const { totalSupply, price } = useNFT()
  const  claimStatus  = useClaimStatus()
  const dispath = useDispatch();

  const onConnect = () => dispath(actions.web3.connectWeb3(true));
  const onCheckBalance = () => {
    if (account) dispath(actions.nft.isClaimable(account));
  };
  switch (status) {
    case "WEB3_STARTUP":
      return (
        <Btn onClick={onConnect} style={{ color: "pink" }}>
          Connect
        </Btn>
      );

    case "NO_WEB3":
      return (
        <Btn
          onClick={onConnect}
          style={{ backgroundColor: "red", border: 0, color: "white" }}
        >
          {error}
        </Btn>
      );
    case "WEB3_CONNECTED":
      switch (claimStatus) {
        case undefined:
          return <Btn disabled>Loading</Btn>;
        case "NOT_IN_LIST":
          return (
            <>
              <Btn disabled>You're not in priory list</Btn>
              You account: {account} not in priority list. <br/>
              Sorry, only Gear hodlers & lobsterDAO hodlers have priority. Come back after 27/01/2022
            </>
          );
        case "ALREADY_CLAIMED":
          return <Btn disabled>You've already claimed token</Btn>;
        case "LESS_1_ETH":
          return (
            <>
              <Btn onClick={onCheckBalance}>Check balance</Btn>
              You should have at least 1 ETH. We compute ETH and WETH balance,
              and Lido stETH as well.
            </>
          );
        case "CLAIM_ALLOWED":
          return <Btn onClick={onCheckBalance}>Mint</Btn>;
        case "CLAIM_PRIORITY_ALLOWED":
          return <Btn onClick={onCheckBalance}>Mint</Btn>;
      }
  }
}
