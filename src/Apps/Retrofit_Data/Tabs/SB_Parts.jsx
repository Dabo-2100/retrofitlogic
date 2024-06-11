import { useRecoilState } from "recoil";
import AddBtn from "../../../components/AddBtn";
import { $ActiveModal, $Server, $Token } from "../../../store";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SB_Parts() {
    const [token] = useRecoilState($Token);
    const [Server_Url] = useRecoilState($Server);
    const [allSBParts, setAllSBParts] = useState([]);
    const [viewSbParts, setViewSBParts] = useState([]);
    function getAllSB_Parts() {
        axios.get(`${Server_Url}/php/index.php/api/sb_parts`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            if (res.data.err == false) {
                setAllSBParts(res.data.data);
                setViewSBParts(res.data.data);
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    function search(value) {
        value = value.toLowerCase();
        let final = allSBParts.filter((sb) => {
            return (sb['part_name'].toLowerCase().indexOf(value) != -1 || sb['part_desc'].toLowerCase().indexOf(value) != -1);
        })
        setViewSBParts(final);
    }

    const handelNewPart = () => {
        setActiveModal(1);
    }

    const [activeModal, setActiveModal] = useRecoilState($ActiveModal);

    useEffect(() => {
        getAllSB_Parts();
    }, []);

    return (
        <div className="col-12 p-3">
            <div className="col-12 d-flex">
                <input
                    className="p-3"
                    type="search"
                    placeholder="Search SB Parts"
                    style={{ width: "calc(100% - 150px)" }}
                    onKeyUp={(e) => {
                        search(e.target.value)
                    }}
                />
                <AddBtn onClick={handelNewPart} name="New Part" />
            </div>

            <table className="table table-dark table-hover table-bordered">
                <thead>
                    <tr>
                        <td className="col-1">-</td>
                        <td className="col-3">SB Part Name</td>
                        <td className="col-6">SB Part Desc</td>
                        {/* <td>Service Bulliten</td> */}
                        <td className="col-2">Total Tasks No</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        viewSbParts.map((SB_Part, index) => {
                            return (
                                <tr key={SB_Part.part_id}>
                                    <td>{index + 1}</td>
                                    <td>{SB_Part.part_name}</td>
                                    <td>{SB_Part.part_desc}</td>

                                    {/* <td>{SB_Part.sb_no}</td> */}
                                    <td>{SB_Part.task_count}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>

    )
}