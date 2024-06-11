import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { $ActiveModal, $ModalData, $Server, $Token } from "../../../store";
import { orderBysb_name } from "../../order_functions";
import AddBtn from "../../../components/AddBtn";
import Modal_sb_details from "../Modals/Modal_sb_details";
export default function Service_Bulletins() {
    const [token] = useRecoilState($Token);
    const [Server_Url] = useRecoilState($Server);
    const [allSbs, setAllSbs] = useState([]);
    const [viewSbs, setViewSbs] = useState([]);
    const [orderMethod, setOrderMethod] = useState();
    const [ActiveModal, setActiveModal] = useRecoilState($ActiveModal);
    const [orderDir, setOrderDir] = useState(0);
    const [ModalData, setModalData] = useRecoilState($ModalData);

    function getAllSBs() {
        axios.get(`${Server_Url}/php/index.php/api/sbs`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            if (res.data.err == false) {
                setAllSbs(res.data.data);
                setViewSbs(res.data.data);
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    function search(value) {
        value = value.toLowerCase();
        let final = allSbs.filter((sb) => {
            return (sb['sb_no'].toLowerCase().indexOf(value) != -1 || sb['sb_name'].toLowerCase().indexOf(value) != -1);
        })
        setViewSbs(final);
    }

    function orderTabel() {

    }

    const handeNewSB = () => {
        setActiveModal(1);
    }
    useEffect(() => {
        getAllSBs();
    }, []);

    return (
        <div className="col-12 p-3">
            <div className="col-12 d-flex">
                <input
                    className="p-3"
                    type="search"
                    placeholder="Search Service Bulltiens"
                    style={{ width: "calc(100% - 150px)" }}
                    onKeyUp={(e) => {
                        search(e.target.value)
                    }}
                />
                <AddBtn onClick={handeNewSB} name="New SB" />
            </div>

            <table className="col-12 table table-dark table-bordered table-hover">
                <thead>
                    <tr>
                        <th className="col-1">-</th>
                        <th onClick={() => { orderBy() }}>Service Bulletin No</th>
                        <th>Service Bulletin Title</th>
                        <th>Service Bulletin Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        viewSbs.map((row, index) => {
                            return (
                                <tr key={row.sb_id} onClick={() => {
                                    let oldData = { ...ModalData };
                                    oldData.sb_id = row.sb_id;
                                    setModalData(oldData);
                                    setActiveModal(1);
                                }}>
                                    <td>{index + 1}</td>
                                    <td>{row['sb_no']}</td>
                                    <td>{row['sb_name']}</td>
                                    <td>{row['sb_date']}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}
