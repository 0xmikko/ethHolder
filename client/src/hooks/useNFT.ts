import { Mood } from "../core/mood";
import { useSelector } from "react-redux";
import { moodSelector } from "../store/nft";

export function useMood(): Mood | undefined {
  const mood = useSelector(moodSelector);
  return mood;
}

// export function useETHPrice(): [number, number] | undefined {
//   const
// }
