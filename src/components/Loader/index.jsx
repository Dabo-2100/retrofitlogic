import "./index.scss";
import IPACOLoader from "./logo.gif";
export default function Loader() {
  return (
    <div className="col-12" id="Loader">
      <img src={IPACOLoader} height={100} />
      {/* <div className="spinner">
        <div className="cube1"></div>
        <div className="cube2"></div>
      </div> */}
    </div>
  );
}
