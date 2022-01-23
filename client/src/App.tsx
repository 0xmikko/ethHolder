import React from "react";
import { AppBar } from "./components/AppBar";
import { Screen } from "./styles";
import { Token } from "./components/Token";
import { MagicButton } from "./components/MagicButton";

export function App() {
  return (
    <Screen>
      <AppBar />
      <Token />
      <MagicButton />
    </Screen>
  );
}
