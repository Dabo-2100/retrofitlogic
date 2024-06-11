import { useRecoilState } from "recoil";
import Logo from "../../../assets/Logo-Light.png";
import { $User_Info } from "../../../store";
import UserBox from "../../SideMenu/UserBox";
export default function LowerBar() {
  const [userInfo] = useRecoilState($User_Info);
  return (
    <div
      className="col-12 d-flex flex-row flex-nowrap justify-content-between align-items-center "
      style={{
        backgroundColor: "#1f242e",
        color: "rgba(255,255,255,.5)",
        borderBottom: "solid #2b313e 1px",
      }}
    >
      <div
        style={{ width: "250px", borderRight: "solid #2b313e 1px" }}
        className="d-flex flex-row justify-content-center align-items-center"
      >
        <img className="py-0" src={Logo} width={103} style={{ scale: 1.2 }} />
      </div>
      <UserBox name="Dabo" role="admin" />
    </div>
  );
}
