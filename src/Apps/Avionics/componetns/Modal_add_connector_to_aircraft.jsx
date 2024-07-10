import { useRecoilState } from "recoil";
import { $Server, $Token, $LoaderIndex, $ActiveModal, $ModalData } from "@/store";
import { useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Modal_add_connector_to_aircraft() {
    const [, setLoaderIndex] = useRecoilState($LoaderIndex)
    const [, setActiveModal] = useRecoilState($ActiveModal);
    const [modalData, setModalData] = useRecoilState($ModalData);
    const [Server_Url] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const searchValue = useRef();
    const [searchRes, setSearchRes] = useState([]);

    const handleCloseModal = () => {
        let data = { ...modalData };
        data.addConnectorsToId = null;
        data.addConnectorsToSN = null;
        setModalData(data);
        setActiveModal(0);
    }

    const handleSearch = () => {
        event.preventDefault();
        setLoaderIndex(1);
        axios.post(`${Server_Url}/php/index.php/api/connectors/search`, {
            connector_name: searchValue.current.value,
            aircraft_id: modalData.addConnectorsToId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((Res) => {
            let res = Res.data;
            if (!res.err) {
                setSearchRes(res.data);
            }
            else {
                setSearchRes([]);
            }
            setLoaderIndex(0);
        }).catch((err) => {
            console.log(err);
        })
    }

    const addConnector = (id, name) => {
        Swal.fire({
            icon: "question",
            showDenyButton: true,
            text: `Are you sure you want to add this connector : ${name} to Aircraft S/N : ${modalData.addConnectorsToSN}`
        }).then((res) => {
            if (res.isConfirmed) {
                axios.post(`${Server_Url}/php/index.php/api/aircrafts/${modalData.addConnectorsToId}/connectors/store`, {
                    connector_id: id,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }).then((Res) => {
                    let res = Res.data;
                    if (!res.err) {
                        handleSearch();
                        Swal.fire({
                            icon: "success",
                            text: "Connector Added to aircraft Successfuly !",
                            timer: 1500,
                        })
                    }
                    else {
                    }
                    setLoaderIndex(0);
                }).catch((err) => {
                    console.log(err);
                })

            }
        })
    }

    const changeOpenStatus = (log_id, field) => {
        event.preventDefault();
        let newVal = event.target.value;
        Swal.fire({
            icon: "question",
            showDenyButton: true,
            text: "Are you sure you want to change the open status ?",
        }).then((res) => {
            if (res.isConfirmed) {
                axios.post(`${Server_Url}/php/index.php/api/update`, {
                    table_name: "connectors_vs_aircrafts",
                    condition: `log_id = ${log_id}`,
                    data: {
                        [field]: +newVal
                    }
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }).then((res) => {
                    handleSearch()
                }).catch((err) => {
                    console.log(err);
                })

            }
        })
    }

    return (
        <div className="Modal" onClick={handleCloseModal} id="Modal_connectors_vs_aircraft">
            <div className="d-flex flex-wrap gap-3 p-3 content animate__animated animate__fadeInDown " onClick={(e) => e.stopPropagation()}>
                <h1 className="header">Add Connectors to Aircraft S/N : {modalData.addConnectorsToSN}</h1>
                <form onSubmit={handleSearch} className="col-12 d-flex align-items-center gap-3">
                    <input className="flex-grow-1 form-control" ref={searchValue} type="search" placeholder="Enter connector P/N" />
                    <button className="btn btn-primary">search</button>
                </form>
                <table className="col-12 table table-bordered">
                    <thead>
                        <tr>
                            <th>-</th>
                            <th>Connector Name</th>
                            <th>Connector Status</th>
                            <th>Open Status</th>
                            <th>Installed Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchRes.map((connector, index) => {
                            // console.log(connector);
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{connector.connector_name}</td>
                                    <td>{connector.is_active ? "Active" : <button onClick={() => addConnector(connector.connector_id, connector.connector_name)} className="btn btn-primary">Add</button>}</td>
                                    <td>
                                        {
                                            connector.is_active ? (<select defaultValue={connector.is_open} onChange={() => changeOpenStatus(connector.is_active, "is_open")} className={`form-select ${connector.is_open == 0 ? "redStatus" :
                                                connector.is_open == 1 ? "greenStatus" :
                                                    connector.is_open == 2 ? "yellowStatus" : "blueStatus"
                                                }`}>
                                                <option value="0">Closed</option>
                                                <option value="1">Open</option>
                                                <option value="2">Disconnected For Access</option>
                                            </select>) : "-"
                                        }
                                    </td>
                                    <td>
                                        {
                                            connector.is_active ? (<select defaultValue={connector.is_orignal} onChange={() => changeOpenStatus(connector.is_active, "is_orignal")} className={`form-select ${connector.is_orignal == 0 ? "greenStatus" :
                                                connector.is_orignal == 1 ? "blueStatus" : "yellowStatus"}`}>
                                                <option value={null} >N/A</option>
                                                <option value="0">Installed</option>
                                                <option value="1">Orignal</option>
                                            </select>) : "-"
                                        }
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
            </div>
        </div>
    )
}
