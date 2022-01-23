import { ThunkNFTAction } from "./index";
import merkle from "../../merkle.json";
import { MerkleDistributorInfo } from "../../core/merkle";
import { CLAIM_PRIORITY } from "../../config";

export const isClaimable =
  (account: string): ThunkNFTAction =>
  async (dispatch, getState) => {
    const { token, minter } = getState().web3;

    if (Date.now() / 1000 > CLAIM_PRIORITY) {
      dispatch(checkBalanceIfAllowed("usual"));
      return;
    }

    const claim = (merkle as MerkleDistributorInfo).claims[
      account.toLowerCase()
    ];
    if (!claim) {
      dispatch({ type: "CLAIM_STATUS", payload: "NOT_IN_LIST" });
      return;
    }

    if (!token || !minter) {
      console.error("NFT OR MINTER undefined!");
      return;
    }

    const isClaimed = await minter.isClaimed(account);

    dispatch(
      isClaimed
        ? { type: "CLAIM_STATUS", payload: "ALREADY_CLAIMED" }
        : checkBalanceIfAllowed("priority")
    );
  };

export const checkBalanceIfAllowed =
  (claimType: "priority" | "usual"): ThunkNFTAction =>
  async (dispatch, getState) => {
    const { minter, signer } = getState().web3;
    if (!minter || !signer) {
      console.error("Minter or signer is undefined");
      return;
    }

    const hasBalance = await minter.connect(signer).checkAccountHasETH();
    dispatch({
      type: "CLAIM_STATUS",
      payload: hasBalance
        ? claimType === "usual"
          ? "CLAIM_ALLOWED"
          : "CLAIM_PRIORITY_ALLOWED"
        : "LESS_1_ETH",
    });
  };
