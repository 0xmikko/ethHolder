export const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID || "1337");
export const MINTER_ADDRESS = process.env.REACT_APP_MINTER_ADDRESS || "";

export const JSON_RPC_PROVIDER =
  process.env.REACT_APP_CHAIN_ID === "42"
    ? process.env.REACT_APP_JSON_RPC_KOVAN
    : process.env.REACT_APP_CHAIN_ID === "1"
    ? process.env.REACT_APP_JSON_RPC_MAINNET
    : process.env.REACT_APP_JSON_RPC_FORK;


export const CLAIM_PRIORITY = 1643065200;
