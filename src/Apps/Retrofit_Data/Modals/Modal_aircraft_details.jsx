import { useRecoilState } from "recoil";
import { $ActiveModal, $ModalData, $Server, $Token } from "../../../store";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Modal_aircraft_details() {
    const [token] = useRecoilState($Token);
    const [Server_Url] = useRecoilState($Server);
    const [ActiveModal, setActiveModal] = useRecoilState($ActiveModal);
    const [ModalData] = useRecoilState($ModalData);
    const [openAircraft, setOpenAircraft] = useState({
        sb_con_req: null,
        sb_id: null,
        sb_date: null,
        sb_name: null,
        sb_no: null,
        sb_parts: []
    });
    useEffect(() => {
        axios.get(`${Server_Url}/php/index.php/api/aircrafts/${ModalData.aircraft_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            setOpenAircraft(res.data.data[0]);
        }).catch((err) => {
            console.log(err);
        })
    }, []);
    return (
        <div className="Modal" id="Modal_aircraft_details" onClick={() => {
            setActiveModal(0);
        }}>
            <div className="content animate__animated d-flex flex-wrap animate__fadeInDown p-3" onClick={(e) => { e.stopPropagation() }}>
                <p className="sectionName py-2">Aircraft Data</p>
                <table className="table table-bordered m-0">
                    <tbody>
                        <tr>
                            <th>Aircraft S/N </th>
                            <td><input className="col-12 form-control" placeholder="Enter SB Name Here" value={openAircraft.aircraft_contract_name} /></td>
                        </tr>
                        <tr>
                            <th>Aircraft Contract Name</th>
                            <td><input className="col-12 form-control" placeholder="Enter SB Name Here" value={openAircraft.aircraft_serial_no} /></td>
                        </tr>
                        <tr>
                            <th>Applicable SB Parts</th>
                            <td>
                                <a href="#" className="text-start col-12" onClick={() => {
                                    setActiveModal(4);
                                }}>{openAircraft.sb_parts_count} </a> SB Parts
                            </td>
                            {/* <td><input type="date" className="col-12 form-control" placeholder="Enter SB Name Here" value={openAircraft.sb_parts_count} /></td> */}
                        </tr>
                    </tbody>
                </table>
                {/* 
                <p className="sectionName py-2 mt-4">SB Parts</p> */}
            </div>
        </div>
    )
}
