import { useRecoilState } from "recoil";
import { $ActiveModal, $ModalData, $Server, $Token } from "@/store";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Modal_applicability() {
    const [token] = useRecoilState($Token);
    const [Server_Url] = useRecoilState($Server);
    const [ActiveModal, setActiveModal] = useRecoilState($ActiveModal);
    const [ModalData] = useRecoilState($ModalData);
    const [applicability, setApplicability] = useState([]);
    useEffect(() => {
        axios.get(`${Server_Url}/php/index.php/api/applicability/${ModalData.aircraft_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            setApplicability(res.data.data);
        }).catch((err) => {
            console.log(err);
        })
    }, []);
    return (
        <div className="Modal" id="Modal_applicability" onClick={() => {
            setActiveModal(0);
        }}>
            <div className="content animate__animated d-flex flex-wrap animate__fadeInDown p-3" onClick={(e) => { e.stopPropagation() }}>
                <p className="sectionName py-2">Applicability</p>
                <table className="table table-bordered m-0">
                    <thead>
                        <tr>
                            <th>-</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            applicability.map((part, index) => {
                                return (
                                    <tr key={part.part_id}>
                                        <td>{part.total_duration}</td>
                                        <td></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                {/* 
                <p className="sectionName py-2 mt-4">SB Parts</p> */}
            </div>
        </div>
    )
}
