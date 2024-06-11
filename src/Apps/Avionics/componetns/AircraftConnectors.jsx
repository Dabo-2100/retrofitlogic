import axios from "axios";
import { useEffect, useState } from "react";
import { useRef } from "react"
import { useRecoilState } from "recoil";
import { $Server, $Token, $LoaderIndex, $ActiveModal, $ModalData } from "@/store";
import Swal from "sweetalert2";

export default function AircraftConnectors() {
    const [Server_Url] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [, setLoaderIndex] = useRecoilState($LoaderIndex)
    const [, setActiveModal] = useRecoilState($ActiveModal);
    const [modalData, setModalData] = useRecoilState($ModalData);

    const [aircrafts, setAircrafts] = useState([]);
    const [selectedID, setSelectedID] = useState();
    const aircraft_id = useRef();

    const getAircrafts = () => {
        setLoaderIndex(1);
        axios.get(`${Server_Url}/php/index.php/api/aircrafts`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {
            if (!res.data.err) {
                setAircrafts(res.data.data);
            }
            setLoaderIndex(0)
        }).catch((err) => {
            console.log(err);
        })
    }

    const getAircraftConnectors = () => {
        let id = aircraft_id.current.value;
        let SN = aircraft_id.current.querySelector(`option[value = "${id}"]`).innerText;
        setLoaderIndex(1);
        axios.post(`${Server_Url}/php/index.php/api/aircrafts/${id}/connectors`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {
            let data = { ...modalData };
            data.addConnectorsToId = id;
            data.addConnectorsToSN = SN;
            setSelectedID(id);
            setModalData(data);
            if (!res.data.err) {

            }
            else {
                Swal.fire({
                    icon: "error",
                    text: "No Connectors founded on this aircraft",
                    timer: 2000,
                }).then(() => {

                });
            }
            setLoaderIndex(0)
        }).catch((err) => {
            console.log(err);
        })

    }

    const openModal = (no) => {
        let data = { ...modalData };
        data.addConnectorsToId = selectedID;
        data.addConnectorsToSN = aircraft_id.current.querySelector(`option[value = "${selectedID}"]`).innerText;;
        setModalData(data);
        setActiveModal(no);
    }

    useEffect(() => {
        getAircrafts();
    }, [])
    return (
        <div className="col-12 d-flex flex-wrap p-4 pb-0 gap-3">
            <h1 className="col-12 header">Aircraft Connectors</h1>
            <div className="col-12 d-flex flex-wrap gap-2 align-items-center">
                <select defaultValue={-1} ref={aircraft_id} id="aircraftsData" className="form-select flex-grow-1" onChange={getAircraftConnectors}>
                    <option value={-1} hidden disabled> Choose Aircraft S/N </option>
                    {
                        aircrafts.map((el, index) => {
                            return (
                                <option key={index} value={el.aircraft_id}>{el.aircraft_serial_no}</option>
                            )
                        })
                    }
                </select>
                {
                    selectedID ? (
                        <div className="col-12 d-flex gap-3">
                            <div id="addBtn" className="svg-wrapper" onClick={() => openModal(7)}>
                                <svg height="60" width="190" xmlns="http://www.w3.org/2000/svg">
                                    <rect className="shape" height="60" width="190"></rect>
                                </svg>
                                <div className="text">Add connectors</div>
                            </div>

                            <div id="viewBtn" className="svg-wrapper" onClick={() => openModal(8)}>
                                <svg height="60" width="190" xmlns="http://www.w3.org/2000/svg">
                                    <rect className="shape" height="60" width="190"></rect>
                                </svg>
                                <div className="text">View connectors</div>
                            </div>

                        </div>
                    ) : null
                }
            </div>
            <hr className="col-12" />
        </div>
    )
}
