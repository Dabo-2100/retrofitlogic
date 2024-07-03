import "./index.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
  $ActiveHomeTab,
  $ActiveModal,
  $MainHeaderH,
  $Server,
  $Token,
  $User_Info,
} from "../../store";
import SideMenu from "../../components/SideMenu";
import axios from "axios";
// Apps
import Warehouse from "../../Apps/Warehouse";
import User_Authority from "../../Apps/Users_Authority";
import Retrofit_Data from "../../Apps/Retrofit_Data";
// Modals
import Modal_sb_details from "../../Apps/Retrofit_Data/Modals/Modal_sb_details";
import Modal_new_sb from "../../Apps/Retrofit_Data/Modals/Modal_new_sb";
import Modal_aircraft_details from "../../Apps/Retrofit_Data/Modals/Modal_aircraft_details";
import Modal_applicability from "../../Apps/Retrofit_Data/Modals/Modal_applicability";
import Modal_sb_part_details from "../../Apps/Retrofit_Data/Modals/Modal_sb_part_details";
import Projects from "../../Apps/Projects";
import Aircraft_Forms from "../../Apps/Aircraft_Forms";
import Modal_Product_Qty from "../../Apps/Warehouse/components/QtyModal";
import Avionics from "../../Apps/Avionics";
import Modal_add_connector_to_aircraft from "@/Apps/Avionics/componetns/Modal_add_connector_to_aircraft.jsx";
import Modal_aircraft_connectos from "@/Apps/Avionics/componetns/Modal_aircraft_connectos.jsx";

import { MenuProvider } from "@/Apps/Projects/ProjectsContext";
// Code Start Here
export default function HomePage() {
  const navigate = useNavigate();
  const [headerH] = useRecoilState($MainHeaderH);
  const [activeTab] = useRecoilState($ActiveHomeTab);
  const [ActiveModal] = useRecoilState($ActiveModal);
  const [tokenCheck, setTokenCheck] = useState();
  const [server] = useRecoilState($Server);
  const [token] = useRecoilState($Token);
  const [userInfo, setUserInfo] = useRecoilState($User_Info);
  const checkUserToken = () => {
    axios
      .get(`${server}/php/index.php/api/auth/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        let res = result.data;
        if (res.err == false) {
          setUserInfo(res.data);
          setTokenCheck(1);
        } else {
          setTokenCheck(0);
          navigate("/login");
        }
      })
      .catch((err) => {
        setTokenCheck(0);
        navigate("/login");
      });
  };

  useEffect(() => {
    checkUserToken();
  }, []);
  return (
    <>
      {tokenCheck == 1 ? (
        <div className="col-12" id="HomePage" style={{ height: "100dvh" }}>
          <SideMenu />
          {/* Apps */}
          {activeTab == 1 ? <Warehouse /> : null}
          {activeTab == 2 ? <Avionics /> : null}
          {activeTab == 3 ? <Aircraft_Forms /> : null}
          {activeTab == 4 ? <Retrofit_Data /> : null}
          {activeTab == 5 ? (
            <MenuProvider>
              <Projects />
            </MenuProvider>
          ) : null}
          {activeTab == 6 ? <User_Authority /> : null}
          {/* Modals */}
          {ActiveModal == 1 ? <Modal_sb_details /> : null}
          {ActiveModal == 2 ? <Modal_new_sb /> : null}
          {ActiveModal == 3 ? <Modal_aircraft_details /> : null}
          {ActiveModal == 4 ? <Modal_applicability /> : null}
          {ActiveModal == 5 ? <Modal_sb_part_details /> : null}
          {ActiveModal == 6 ? <Modal_Product_Qty /> : null}
          {ActiveModal == 7 ? <Modal_add_connector_to_aircraft /> : null}
          {ActiveModal == 8 ? <Modal_aircraft_connectos /> : null}
        </div>
      ) : null}
    </>
  );
}
