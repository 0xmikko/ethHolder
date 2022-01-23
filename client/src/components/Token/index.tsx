import React from "react";
import { useMood } from "../../hooks/useMood";
import { moodToImage } from "../../core/mood";

export function Token(): React.ReactElement {
  const mood = useMood();

  return mood ? <img src={moodToImage[mood]} height={"160px"}  alt={mood.toString()}/> : <>Loading</>;
}
