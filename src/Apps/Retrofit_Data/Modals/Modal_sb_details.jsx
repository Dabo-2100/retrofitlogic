import { useRecoilState } from "recoil";
import { $ActiveModal, $ModalData, $Server, $Token } from "../../../store";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Modal_sb_details() {
    const [token] = useRecoilState($Token);
    const [Server_Url] = useRecoilState($Server);
    const [ActiveModal, setActiveModal] = useRecoilState($ActiveModal);
    const [ModalData, setModalData] = useRecoilState($ModalData);
    const [openSB, setOpenSB] = useState({
        sb_con_req: null,
        sb_id: null,
        sb_date: null,
        sb_name: null,
        sb_no: null,
        sb_parts: []
    });
    useEffect(() => {
        axios.get(`${Server_Url}/php/index.php/api/sbs/${ModalData.sb_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            setOpenSB(res.data.data[0]);
        }).catch((err) => {
            console.log(err);
        })
    }, []);
    return (
        <div className="Modal" id="Modal_sb_details" onClick={() => {
            setActiveModal(0);
        }}>
            <div className="content animate__animated d-flex flex-wrap animate__fadeInDown p-3" onClick={(e) => { e.stopPropagation() }}>
                <p className="sectionName py-2">Service Bulliten Data</p>
                <table className="table table-bordered m-0">
                    <tbody>
                        <tr>
                            <th>SB No</th>
                            <td><input className="col-12 form-control" placeholder="Enter SB Name Here" value={openSB.sb_no} /></td>
                        </tr>
                        <tr>
                            <th>SB Name</th>
                            <td><input className="col-12 form-control" placeholder="Enter SB Name Here" value={openSB.sb_name} /></td>
                        </tr>
                        <tr>
                            <th>SB Date</th>
                            <td><input type="date" className="col-12 form-control" placeholder="Enter SB Name Here" value={openSB.sb_date} /></td>
                        </tr>
                    </tbody>
                </table>

                <p className="sectionName py-2 mt-4">SB Parts</p>
                <table className="col-12 table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-1">-</th>
                            <th className="col-4">SB Part Name</th>
                            <th className="col-5">SB Part Desc</th>
                            <th className="col-2">SB Tasks No</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            openSB.sb_parts.map((sb_part, index) => {
                                return (
                                    <tr key={sb_part.part_id}>
                                        <td>{index + 1}</td>
                                        <td>{sb_part.part_name}</td>
                                        <td>{sb_part.part_desc}</td>
                                        <td>{Math.trunc(Math.random() * 1000)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
