import { useRecoilState } from "recoil";
import AddBtn from "../../../components/AddBtn";
import { $ActiveModal, $ModalData, $Server, $Token } from "../../../store";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Aircrafts() {
    const [token] = useRecoilState($Token);
    const [Server_Url] = useRecoilState($Server);
    const [allAircrafts, setAllAircrafts] = useState([]);
    const [viewAircrafts, setviewAircrafts] = useState([]);
    const [modalData, setModalData] = useRecoilState($ModalData);

    function getAllAricrafts() {
        axios.get(`${Server_Url}/php/index.php/api/aircrafts`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            if (res.data.err == false) {
                setAllAircrafts(res.data.data);
                setviewAircrafts(res.data.data);
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    function search(value) {
        value = value.toLowerCase();
        let final = allAircrafts.filter((sb) => {
            return (sb['aircraft_serial_no'].toLowerCase().indexOf(value) != -1 || sb['aircraft_contract_name'].toLowerCase().indexOf(value) != -1);
        })
        setviewAircrafts(final);
    }

    const handelNewPart = () => {
        setActiveModal(1);
    }

    const [activeModal, setActiveModal] = useRecoilState($ActiveModal);

    useEffect(() => {
        getAllAricrafts();
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
                        <td className="col-3">Aircraft S/N </td>
                        <td className="col-7">Aircraft Contract Name</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        viewAircrafts.map((aircraft, index) => {
                            return (
                                <tr key={aircraft.aircraft_id} onClick={() => {
                                    let old = { ...modalData };
                                    old.aircraft_id = aircraft.aircraft_id;
                                    setModalData(old);
                                    setActiveModal(3);
                                }}>
                                    <td>{index + 1}</td>
                                    <td>{aircraft.aircraft_serial_no}</td>
                                    <td>{aircraft.aircraft_contract_name}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>

    )
}