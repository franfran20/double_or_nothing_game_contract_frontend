import { useMoralisQuery } from "react-moralis";
import { Recents } from "./Recents";

export const RecentPlays = ({ refetchProp }) => {
  const {
    data: lostData,
    error: lostError,
    isLoading: lostLoading,
  } = useMoralisQuery(
    "PlayedEvents",
    (query) => query.descending("createdAt").limit(3).equalTo("won", false),
    [refetchProp]
  );

  const {
    data: wonData,
    error: wonError,
    isLoading: wonLoading,
  } = useMoralisQuery(
    "PlayedEvents",
    (query) => query.descending("createdAt").limit(3).equalTo("won", true),
    [refetchProp]
  );

  if (wonError || lostError) {
    return <p>ERRor!!!</p>;
  }

  return (
    <div className="recentWrapper">
      {lostLoading ? (
        <p className="white">Loading....</p>
      ) : (
        <div className="recentPlayers">
          <h2 className="green">Last 3 Losers</h2>
          {lostData.map(({ attributes }, index) => {
            return <Recents key={index} attribute={attributes} />;
          })}
        </div>
      )}

      {wonLoading ? (
        <p className="white">Loading....</p>
      ) : (
        <div className="recentPlayers">
          <h2 className="green">Last 3 Winners</h2>
          {wonData.map(({ attributes }, index) => {
            return <Recents key={index} attribute={attributes} />;
          })}
        </div>
      )}
    </div>
  );
};
