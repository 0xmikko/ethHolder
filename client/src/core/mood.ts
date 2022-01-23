import toTheMoon from "../assets/toTheMoon.png";
import bullish from "../assets/bullish.png";
import stable from "../assets/stable.png";
import panic from "../assets/panic.png";
import applyingToMcDonalds from "../assets/applyingToMcDonalds.png";

export enum Mood {
  TO_THE_MOON,
  BULLISH,
  STABLE,
  PANIC,
  APPLYING_TO_MC_DONALDS,
}

export const moodToImage = {
  [Mood.TO_THE_MOON]: toTheMoon,
  [Mood.BULLISH]: bullish,
  [Mood.STABLE]: stable,
  [Mood.PANIC]: panic,
  [Mood.APPLYING_TO_MC_DONALDS]: applyingToMcDonalds,
};

export const moodToText = {
  [Mood.TO_THE_MOON]: "To the Moon",
  [Mood.BULLISH]: "Bullish",
  [Mood.STABLE]: "Stable",
  [Mood.PANIC]: "Panic",
  [Mood.APPLYING_TO_MC_DONALDS]: "Applying to McDonalds",
};
