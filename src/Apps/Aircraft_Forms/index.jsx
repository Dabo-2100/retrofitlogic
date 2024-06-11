import React from "react";
import { useRecoilState } from "recoil";
import Form_Modal from "./Form_Modal";
import "./index.scss";
import { $ActiveModal, $ActiveForm } from "@/store";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useEffect, useState } from "react";

import f_1001 from "@/assets/1001.png";
import f_1002 from "@/assets/1002.png";
import f_1003 from "@/assets/1003.png";
import f_1003_b from "@/assets/1003_b.png";
import axios from "axios";
import { $Server, $Token } from "@/store";
import { $FormData, $LoaderIndex, $activeRoute, $formRoutes } from "../../store";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faFolder, faGrip, faHouse, faList, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import HomeRoute from "./components/HomeRoute";
import FolderRoute from "./components/FolderRoute";

export default function Aircraft_Forms() {
    const [activeModal] = useRecoilState($ActiveModal);
    const [routes, setRoutes] = useRecoilState($formRoutes);
    const [activeRoute, setActiveRoute] = useRecoilState($activeRoute);
    const [, setFolderContentIndex] = useState(0);

    const changeRoute = (no) => {
        setActiveRoute(no);
        let oldRoutes = [...routes];
        oldRoutes.length == 3 ? oldRoutes.pop() : null;
        setRoutes(oldRoutes);
    }
    return (
        <div id="Aircraft_Forms" className="workingTab p-0" onClick={() => { setFolderContentIndex(0) }}>
            <div className="col-12" id="filesCounter">
                <p>Form Drive</p>
            </div>
            <div className="col-12 d-flex align-items-center justify-content-between" id="breadcrumb">
                <div className="routing d-flex gap-2">
                    {
                        routes.map((route, index) => {
                            return (
                                <React.Fragment key={index}>
                                    {route == "Home" ?
                                        <FontAwesomeIcon onClick={() => { changeRoute(0) }} className={`route ${activeRoute == index ? 'active' : null}`} icon={faHouse} /> :
                                        <label onClick={() => { route == "Aircrafts" ? changeRoute(1) : null }} className={`route ${activeRoute == index ? 'active' : null}`}>{route}</label>}
                                    {index + 1 != routes.length ? <FontAwesomeIcon className="seprator" icon={faAngleRight} /> : null}
                                </React.Fragment>
                            )
                        })
                    }
                </div>
                <div className="routingView d-flex gap-3">
                    <FontAwesomeIcon className="icon" icon={faGrip} />
                    <FontAwesomeIcon className="icon" icon={faList} />
                </div>
            </div>
            {activeRoute == 0 ? <HomeRoute /> : null}
            {activeRoute == 1 ? <HomeRoute /> : null}
            {activeRoute == 2 ? <FolderRoute /> : null}
            {activeModal == 1000 ? <Form_Modal /> : null}
        </div >
    )
}