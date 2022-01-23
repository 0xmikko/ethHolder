import React from "react";
import {useWeb3} from "../../hooks/useWeb3";
import {useDispatch} from "react-redux";
import actions from "../../store/actions";

export function MagicButton(): React.ReactElement {
  const { status } = useWeb3();
  const dispath = useDispatch();

  const onClick = () => dispath(actions.web3.connectWeb3(true));

  return <button onClick={onClick}>Connect</button>;
}
