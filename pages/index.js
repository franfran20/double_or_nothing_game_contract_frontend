import styles from "../styles/Home.module.css";
import { PlayComponenet } from "../components/PlayComponenet";
import { useMoralis, useMoralisSubscription } from "react-moralis";
import { useNotification } from "web3uikit";

export default function Home() {
  useMoralisSubscription("PlayedEvents", (q) => q, [], {
    onUpdate: (data) => handleWinOrLoss(data),
  });
  const {
    isWeb3Enabled,
    deactivateWeb3,
    chainId: chainIdHex,
    enableWeb3,
  } = useMoralis();
  const dispatch = useNotification();

  //current ChainId
  let chainId = parseInt(chainIdHex).toString();

  //handle win or loss by dispatching notifictaion
  function handleWinOrLoss(eventData) {
    //console.log(eventData.attributes);
    let attributes = eventData.attributes;
    if (attributes.won == true) {
      dispatch({
        type: "success",
        message: `You just won ${attributes.amount / 10 ** 18}`,
        title: "Won Game",
        icon: "checkmark",
        position: "topR",
      });
    }
    if (attributes.won == false) {
      dispatch({
        type: "error",
        message: `You just lost ${attributes.amount / 10 ** 18}`,
        title: "Lost Game",
        icon: "exclamation",
        position: "topR",
      });
    }
  }

  return (
    <div>
      {isWeb3Enabled && chainId == "80001" ? (
        <div className={styles.container}>
          {/* //make this function pop up an option for walletconnect and metamask, so that you can test with different wallets */}
          <button onClick={() => deactivateWeb3()} className="disconnect">
            Disconnect
          </button>

          <PlayComponenet />
        </div>
      ) : (
        <>
          <div className={styles.notConnected}>
            <nav>
              <button onClick={() => enableWeb3()}>Connect</button>
              <h2>FRANFRAN_E</h2>
            </nav>

            <div className={styles.promptConnect}>
              <h3 style={{ color: "white" }}>
                WELCOME TO THE DOUBLE OR NOTHING GAME!
              </h3>
              <p className="green">
                Please connect your wallet and make sure you are in the mumbai
                testnet or ganache
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
