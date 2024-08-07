import { useEffect, useState } from "react";
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRecoilState } from "recoil";
import { $ActiveHomeTab, $HomeTabs, $Token, $User_Info } from "../../store";
import { faBars, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo-Light.png";
import icon from "@/assets/ipaco_logo.png";
import UserBox from "./UserBox";
// import { user_login } from "../../../pages/Api";
export default function SideMenu() {
  const navigate = useNavigate();
  const [tabs] = useRecoilState($HomeTabs);
  const [, setToken] = useRecoilState($Token);
  const [user_info, setUserInfo] = useRecoilState($User_Info);
  const [activeTab, setActiveTab] = useRecoilState($ActiveHomeTab);
  const [activeApps, setActiveApps] = useState([]);

  const [menuStatus, setMenuStaus] = useState(false);

  const openTab = (id) => {
    setActiveTab(id);
  };
  const Logout = () => {
    Swal.fire({
      icon: "question",
      title: "Are you sure you want to exit the system ?",
      showDenyButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        setUserInfo(null);
        setToken(null);
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login");
      }
    });
  };
  const handleShrink = () => {
    alert('test');
  };
  useEffect(() => {
    // console.log(user_info);
    setActiveApps(
      user_info.user_apps.map((app) => {
        return app["app_id"];
      })
    );
    setActiveTab(user_info.user_apps[0].app_id);
  }, []);

  return (
    <div
      id="SideMenu"
      className="animate__animated animate__fadeInLeft"
      style={{ animationDuration: "600ms" }}
    >
      <div
        style={{ borderBottom: "solid #2b313e 1px" }}
        className="d-flex flex-row justify-content-between p-3 align-items-center col-12"
      >
        <div className="d-flex align-items-center gap-1">
          <img className="py-0 logo" src={icon} width={30} />
          <p className="mb-0 text-white">iPACOFit</p>
        </div>
        <FontAwesomeIcon
          icon={faBars}
          className="iconBars"
          onClick={handleShrink}
        />
      </div>
      <ul>
        {tabs.map((tab, index) => {
          if (activeApps.indexOf(tab.id) != -1) {
            return (
              <li
                key={tab.id}
                onClick={() => {
                  openTab(tab.id);
                }}
                className={`animate__animated animate__fadeInUp ${
                  activeTab == tab.id ? "active" : null
                }`}
                style={{ animationDelay: `${400 + index * 150}ms` }}
              >
                <FontAwesomeIcon className="icon" icon={tab.icon} />
                <p>{tab.name}</p>
              </li>
            );
          }
        })}
      </ul>
      <div className="col-12" id="downPart">
        <UserBox name={user_info.user_name} role="admin" />
        <div
          className="col-12"
          id="Logout"
          onClick={() => {
            Logout();
          }}
        >
          <FontAwesomeIcon icon={faPowerOff} />
          <p>Logout</p>
        </div>
      </div>
    </div>
  );
}
