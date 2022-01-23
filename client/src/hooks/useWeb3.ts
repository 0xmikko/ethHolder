import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {web3Selector} from "../store/web3";
import {Web3State} from "../store/web3/reducer";
import actions from "../store/actions";

export function useWeb3(): Web3State {
    const dispatch = useDispatch();
    const web3 = useSelector(web3Selector);


    useEffect(() => {
        if (web3.provider === undefined && window.ethereum) {
            dispatch(actions.web3.connectWeb3());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, web3.provider]);

    return web3;
}
