import React, { useContext } from "react";
import Form_Modal from "./Form_Modal";
import "./index.scss";
// import { useRecoilState } from "recoil";
// import { $ActiveModal, $ActiveForm } from "@/store";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useEffect, useState } from "react";

// import { $LoaderIndex, $activeRoute, $formRoutes } from "../../store";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faGrip,
  faHouse,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import HomeRoute from "./components/HomeRoute";
import FolderRoute from "./components/FolderRoute";
import New_Aricraft from "./Modals/New_Aricraft";
import { FormContext } from "./FormContext";

export default function Aircraft_Forms() {
  const { routes, setRoutes, activeRoute, setActiveRoute, activeModal } =
    useContext(FormContext);

  const changeRoute = (no) => {
    setActiveRoute(no);
    let oldRoutes = [...routes];
    oldRoutes.length == 3 ? oldRoutes.pop() : null;
    setRoutes(oldRoutes);
  };

  let addData = async () => {
    try {
      const docRef = await setDoc(doc(db, "Aircrafts", "49079"), {
        aircraft_type: "AW-149",
        airframe_hrs: 1200,
        is_active: true,
        mk_no: 12,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  useEffect(() => {
    // addData();
  }, []);
  return (
    <div id="Aircraft_Forms" className="workingTab p-0">
      <div
        id="breadcrumb"
        className="col-12 d-flex align-items-center justify-content-between"
      >
        <div className="routing d-flex gap-2">
          {routes.map((route, index) => {
            return (
              <React.Fragment key={index}>
                {route == "Home" ? (
                  <FontAwesomeIcon
                    onClick={() => {
                      changeRoute(0);
                    }}
                    className={`route ${
                      activeRoute == index ? "active" : null
                    }`}
                    icon={faHouse}
                  />
                ) : (
                  <label
                    onClick={() => {
                      route == "Aircrafts" ? changeRoute(1) : null;
                    }}
                    className={`route ${
                      activeRoute == index ? "active" : null
                    }`}
                  >
                    {route}
                  </label>
                )}
                {index + 1 != routes.length ? (
                  <FontAwesomeIcon className="seprator" icon={faAngleRight} />
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
        {/* <div className="routingView d-flex gap-3">
          <FontAwesomeIcon className="icon" icon={faGrip} />
          <FontAwesomeIcon className="icon" icon={faList} />
        </div> */}
      </div>
      {/* Routes */}
      {activeRoute == 0 ? <HomeRoute /> : null}
      {activeRoute == 1 ? <HomeRoute /> : null}
      {activeRoute == 2 ? <FolderRoute /> : null}
      {/* Modals */}
      {activeModal == 1000 ? <Form_Modal /> : null}
      {activeModal == 1001 ? <New_Aricraft /> : null}
    </div>
  );
}
