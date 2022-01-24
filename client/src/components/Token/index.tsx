import React from "react";
import { useNFT } from "../../hooks/useNFT";
import { moodToImage, moodToText } from "../../core/mood";
import loadingMood from "../../assets/loading.png";

export function Token(): React.ReactElement {
  const { price, mood, diff, totalSupply } = useNFT();

  const image = (
    <img
      src={mood ? moodToImage[mood] : loadingMood}
      height={"360px"}
      alt={mood?.toString() || "loading"}
    />
  );
  const diffStr = diff ? (diff > 0 ? `+${diff}%` : `${diff}%`) : "Loading";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "50px",
      }}
    >
      {image}
      <div style={{ marginLeft: "20px", textAlign: "left" }}>
        <h1>
          Price: {price || ""}{" "}
          <span style={{ color: diff && diff > 0 ? "green" : "red" }}>
            {" "}
            {diffStr}{" "}
          </span>
        </h1>
        <h1>
          Mood:{" "}
          {mood ? (
            <span
              style={{
                color: diff
                  ? diff > 3
                    ? "green"
                    : diff < -3
                    ? "red"
                    : "white"
                  : "white",
              }}
            >
              {moodToText[mood]}
            </span>
          ) : "Loading"}
        </h1>
        <h1>Minted: {totalSupply}</h1>
        <h1>
          Available:{" "}
          {price ? (
            <>
              {" "}
              {`${Math.floor(price)} - ${totalSupply} = `}{" "}
              {Math.floor(price) - totalSupply}
            </>
          ) : "Loading"}
        </h1>
      </div>
    </div>
  );
}
