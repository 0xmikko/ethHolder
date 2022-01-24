import React from "react";
import { useWeb3 } from "../../hooks/useWeb3";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";
import { Btn } from "./styles";
import { useClaimStatus, useNFT } from "../../hooks/useNFT";
import { TwitterShareButton } from "react-share";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

export function MagicButton(): React.ReactElement {
  const { status, account, error } = useWeb3();
  const { totalSupply, price, mintingProcess } = useNFT();
  const claimStatus = useClaimStatus();
  const dispath = useDispatch();

  const onConnect = () => dispath(actions.web3.connectWeb3(true));
  const onCheckBalance = () => {
    if (account) dispath(actions.nft.isClaimable(account));
  };

  const onMint = () => {
    if (account) dispath(actions.nft.mint());
  };

  const onMintPriority = () => {
    if (account) dispath(actions.nft.mintPriority());
  };

  switch (status) {
    case "WEB3_STARTUP":
      return <Btn onClick={onConnect}>Connect</Btn>;

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
              You account: {account} not in priority list. <br />
              Sorry, only Gear hodlers & lobsterDAO hodlers have priority. Come
              back after 27/01/2022.
            </>
          );
        case "ALREADY_CLAIMED":
          return (
            <>
              <Btn disabled>You've already claimed token</Btn>
              You account: {account} has already mined a token. <br />
              You can mint more after 27/01/2022.
            </>
          );
        case "LESS_1_ETH":
          return (
            <>
              <Btn onClick={onCheckBalance}>Check balance</Btn>
              You should have at least 1 ETH. We compute ETH and WETH balance,
              and stETH as well.
            </>
          );
        case "CLAIM_ALLOWED":
        case "CLAIM_PRIORITY_ALLOWED":
          if (Math.floor(price || 0) < totalSupply) {
            return (
              <>
                <Btn disabled>No tokens available</Btn>
                Please, wait then the ETH price will be higher.
              </>
            );
          }

          switch (mintingProcess) {
            case "WAIT":
              return (
                <Btn
                  onClick={
                    claimStatus === "CLAIM_ALLOWED" ? onMint : onMintPriority
                  }
                >
                  Mint
                </Btn>
              );

            case "WAIT_METAMASK":
              return <Btn disabled>Please, confirm tx in Metamask</Btn>;
            case "MINTING":
              return <Btn disabled>Minting...</Btn>;
            case "ERROR":
              return (
                <Btn disabled style={{ backgroundColor: "red" }}>
                  Unknown error
                </Btn>
              );
            case "DONE":
              return (
                <TwitterShareButton
                  url={"https://hodler-nft.com"}
                  title="I've just minted ETH HODLER NFT baked by @mikaellazarev. Lets HODL ETH Together!"
                  style={{ width: "100%", marginBottom: 0 }}
                  hashtags={["ntf", "eth", "hodl"]}
                >
                  <Btn>
                    <FontAwesomeIcon
                      icon={faTwitter}
                      style={{ marginRight: "5px" }}
                    />
                    Share on Twitter
                  </Btn>
                </TwitterShareButton>
              );
          }
      }
  }
}
