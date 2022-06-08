import { useState } from "react";
import {
  useMoralis,
  useNativeBalance,
  useWeb3ExecuteFunction,
} from "react-moralis";
import { contractAddress } from "../constants/contractAddress";
import { ABI } from "../constants/abi";
import { useNotification } from "web3uikit";
import { RecentPlays } from "../components/RecentPlays";

export const PlayComponenet = () => {
  const { chainId: hexChainId } = useMoralis();
  const [waitingForChainlinkVRF, setWaitingForChainlinkVRF] = useState(false);
  const [refetch, setRefetch] = useState(true);
  const [inputValue, setInputValue] = useState("");

  //dispatch notification
  const dispatch = useNotification();
  //contract Address
  let chainIdHex = parseInt(hexChainId).toString();
  let contractAddr = contractAddress[chainIdHex];
  //error messages
  let exceedContractBal = "err: insufficient funds for gas * price + value:";
  let inputWasZero = "execution reverted: Invalid Amount";
  //get contract balance
  const { data: balance } = useNativeBalance({
    chain: "mumbai",
    address: contractAddr,
  });
  const {
    fetch: playGame,
    error,
    isFetching,
    isLoading,
  } = useWeb3ExecuteFunction({
    abi: ABI,
    contractAddress: contractAddr,
    functionName: "playGame",
    params: "",
    msgValue: inputValue,
  });
  //handle errors
  function handleError() {
    if (error) {
      if (error.data) {
        if (error.data.message.includes(exceedContractBal)) {
          return (
            <p style={{ color: "red", fontSize: "24px", fontWeight: "800" }}>
              Please input an amount less than the specified balance above
            </p>
          );
        }
        if (error.data.message.includes(inputWasZero)) {
          return (
            <p style={{ color: "red", fontSize: "24px", fontWeight: "800" }}>
              Please input an amount less than the specified balance above
            </p>
          );
        }
      }
    }
  }

  //triggers when user plays game
  async function handlePlayGame(txData) {
    dispatch({
      type: "success",
      message: `You just played with ${inputValue / 10 ** 18}`,
      title: "Played Game",
      icon: "checkmark",
      position: "topR",
    });
    setWaitingForChainlinkVRF(true);
    await txData.wait(6);
    setWaitingForChainlinkVRF(false);
    setRefetch((prev) => !prev);
    //router.reload(window.location.pathname);
  }

  //makes the user wait on page...
  if (waitingForChainlinkVRF) {
    return (
      <div className="WaitingForVrf">
        <p className="green">
          Hey there, We're trying to get an outcome for your play. Don't go
          anywhere... A notification will be dispatched to yiu based on your
          result. LG! The suspense is Killing I know..
        </p>
      </div>
    );
  }

  return (
    <div className="introWrapper">
      <h1>Double Or Nothing Game</h1>
      <p>
        <b className="green">HOW TO PLAY: </b>Play the game with any amount of
        your choice but it has to be lower than the balance displayed below.
        Once played you stand a chance of winning DOUBLE YOUR AMOUNT!!....or you
        lose everything.LOL :D... The choice is yours! Please have a good
        internet connection.. If you've just recently played. Check the recent
        winners or losers for your address.
      </p>
      <h3 className="balance">
        BALANCE: <b className="white">{balance.balance / 10 ** 18 / 2}</b>
      </h3>
      <div className="play">
        <input
          type="number"
          onChange={(e) =>
            setInputValue((e.target.value * 10 ** 18).toString())
          }
        />

        {!isFetching || !isLoading ? (
          <button
            onClick={async () => await playGame({ onSuccess: handlePlayGame })}
          >
            Play
          </button>
        ) : (
          <button disabled>...</button>
        )}
      </div>
      {error && handleError()}
      <RecentPlays refetchProp={refetch} />
    </div>
  );
};
