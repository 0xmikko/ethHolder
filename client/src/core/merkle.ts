export interface MerkleDistributorInfo {
  contract?: string;
  merkleRoot: string;
  claims: {
    [account: string]: {
      index: number;
      salt: string;
      proof: string[];
    };
  };
}

export type ClaimStatus =
  | "NOT_IN_LIST"
  | "ALREADY_CLAIMED"
  | "CLAIM_PRIORITY_ALLOWED"
  | "CLAIM_ALLOWED"
  | "LESS_1_ETH";

export type MintingStatus =
  | "WAIT"
  | "WAIT_METAMASK"
  | "MINTING"
  | "DONE"
  | "ERROR";
