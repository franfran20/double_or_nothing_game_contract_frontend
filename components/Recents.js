export const Recents = ({ attribute }) => {
  return (
    <div key={attribute.objectId} style={{ color: "white" }}>
      <b className="green recentText">Address: </b>
      <br />
      <p>{attribute.player}</p>
      <br />
      <b className="green recentText">Amount Lost: </b>
      <br />
      <p>{attribute.amount / 10 ** 18} Matic</p>
    </div>
  );
};
