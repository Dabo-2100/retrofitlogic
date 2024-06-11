import { useRecoilState } from "recoil";
import "./index.scss";
import { $Server } from "../../../store";
export default function UserBox(props) {
  const [Server_Url] = useRecoilState($Server);
  return (
    <div id="UserBox">
      <img src={`${Server_Url}/php/media/${props.imgUrl ? `${props.imgUrl}.png` : "user.png"}`} />
      <div className="data">
        <h3 className="col-12">{props.name}</h3>
        <p className="col-12">{props.role}</p>
      </div>
    </div>
  );
}
