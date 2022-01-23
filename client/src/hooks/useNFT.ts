import { useDispatch, useSelector } from "react-redux";
import { nftSelector } from "../store/nft";
import { NFTState } from "../store/nft/reducer";
import { ClaimStatus } from "../core/merkle";
import { useWeb3 } from "./useWeb3";
import { useEffect } from "react";
import actions from "../store/actions";

export function useNFT(): NFTState {
  return useSelector(nftSelector);
}

export function useClaimStatus(): ClaimStatus | undefined {
  const { signer, account } = useWeb3();
  const dispatch = useDispatch();
  const { claimStatus } = useSelector(nftSelector);

  useEffect(() => {
    if (signer && account) {
      dispatch(actions.nft.isClaimable(account));
    }
  }, [account]);

  return claimStatus;
}
