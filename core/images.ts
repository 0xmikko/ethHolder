export const ipfsPictures = [
  {
    path: "toTheMoon.png",
    hash: "QmdLnmga6bno3TMh8WUENjqbph96XAUaWiP3ydpKv9Nfac",
    size: 155254,
  },
  {
    path: "bullish.png",
    hash: "QmSk4mFjmXdBLkJFUmmCpGhFrkhfRRujTgNwmv3zeJY94J",
    size: 139269,
  },
  {
    path: "stable.png",
    hash: "QmWTjPHjJsEce18xYYzfSKjmz2YWeSDspNUjnTq8DsGoYF",
    size: 63542,
  },
  {
    path: "panic.png",
    hash: "QmTVmzkCLemQ2ERVgLC1y9wrNqdtJ44yLewLNFak1sPsBg",
    size: 96553,
  },

  {
    path: "applyingToMcDonalds.png",
    hash: "QmS1jTRwAV7PENAorRzMEKz6pPhGbWix2zLuRRvAjQcMHN",
    size: 80308,
  },
];

export const imagesURL = ipfsPictures.map(
  (ipfs) => `https://ipfs.io/ipfs/${ipfs.hash}/`
);
