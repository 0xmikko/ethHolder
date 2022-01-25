import { ThunkNFTAction } from "./index";
import merkle from "../../merkle.json";
import { MerkleDistributorInfo } from "../../core/merkle";
import { CLAIM_PRIORITY, MINTER_ADDRESS } from "../../config";
import {
  AggregatorV3Interface__factory,
  Minter,
  Minter__factory,
} from "../../typechain";

export const nftState = (): ThunkNFTAction => async (dispatch, getState) => {
  const { token, provider, minter } = getState().web3;

  if (!minter || !provider || !minter || !token) {
    console.error("NFT/Provider/Minter is undefied");
    return;
  }

  const chainLinkOracle = AggregatorV3Interface__factory.connect(
    "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    provider
  );

  const mood = await token.getMarketMood();
  const diff = await token.getPriceChange();
  const price = (await chainLinkOracle.latestRoundData()).answer;
  const totalSupply = (await minter.totalSupply()).toNumber();

  dispatch({
    type: "MOOD_SUCCESS",
    payload: {
      mood,
      diff: diff.toNumber() / 100,
      price: price.div(1e6).toNumber() / 100,
      totalSupply,
    },
  });
};

export const isClaimable =
  (account: string): ThunkNFTAction =>
  async (dispatch, getState) => {
    const { token, minter } = getState().web3;

    if (Date.now() / 1000 > CLAIM_PRIORITY) {
      dispatch(checkBalanceIfAllowed("usual"));
      return;
    }

    const claim = (merkle as MerkleDistributorInfo).claims[account];

    if (!claim) {
      dispatch({ type: "CLAIM_STATUS", payload: "NOT_IN_LIST" });
      return;
    }

    if (!token || !minter) {
      console.error("NFT OR MINTER undefined!");
      return;
    }

    const isClaimed = await minter.isClaimed(claim.index);

    console.log(isClaimed)

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

export const mint = (): ThunkNFTAction => async (dispatch, getState) => {
  const { minter, signer } = getState().web3;
  if (!minter || !signer) {
    console.error("Minter or signer is undefined");
    return;
  }
  try {
    dispatch({ type: "MINTING_STATUS", payload: "WAIT_METAMASK" });
    const receipt = await minter.connect(signer).claim();

    dispatch({ type: "MINTING_STATUS", payload: "MINTING" });
    await receipt.wait();
    dispatch({ type: "MINTING_STATUS", payload: "DONE" });
  } catch (e) {
    console.error(e);
    dispatch({ type: "MINTING_STATUS", payload: "ERROR" });
  }

  dispatch(nftState());
};

export const mintPriority =
  (): ThunkNFTAction => async (dispatch, getState) => {
    const { signer, account } = getState().web3;
    if (!signer || !account) {
      console.error("Minter or signer is undefined");
      return;
    }
    try {
      const claim = (merkle as MerkleDistributorInfo).claims[account];
      if (!claim) {
        dispatch({ type: "MINTING_STATUS", payload: "ERROR" });
        return;
      }

      dispatch({ type: "MINTING_STATUS", payload: "WAIT_METAMASK" });

      const minter = Minter__factory.connect(MINTER_ADDRESS, signer) as Minter;

      // const maxGasFee = await signer.getGasPrice();

      const receipt = await minter
        .connect(signer)
        .claimMerkle(claim.index, claim.salt, claim.proof, {
          // maxFeePerGas: maxGasFee.mul(12).div(10),
        });

      dispatch({ type: "MINTING_STATUS", payload: "MINTING" });
      await receipt.wait();
      dispatch({ type: "MINTING_STATUS", payload: "DONE" });
    } catch (e) {
      console.error(e);
      dispatch({ type: "MINTING_STATUS", payload: "ERROR" });
    }

    dispatch(nftState());
  };
