import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  let APP_ID = process.env.NEXT_PUBLIC_APP_ID;
  let SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  return (
    <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
      <NotificationProvider>
        <Head>
          <title>Double Or Nothing.</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
            rel="stylesheet"
          />
        </Head>
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  );
}

export default MyApp;
