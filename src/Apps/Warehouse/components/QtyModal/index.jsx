import { useRecoilState } from "recoil";
import { $ActiveModal, $ModalData, $Server, $Token } from "@/store";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Modal_Product_Qty() {
    const [, setActiveModal] = useRecoilState($ActiveModal);
    const [modalData] = useRecoilState($ModalData);
    const [Server_Url] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [qtyDetailed, setQtyDetailed] = useState([]);
    useEffect(() => {
        let product_id = modalData.product_id;
        axios.get(`${Server_Url}/php/index.php/api/warehouse/products/qty/${product_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((Res) => {
            let res = Res.data;
            console.log(res);
            if (!res.err) {
                setQtyDetailed(res.data);
            }
            else {
                setQtyDetailed([]);
            }
        }).catch((err) => {
            console.log(err);
        })
    }, []);
    return (
        <div className="col-12 Modal" id="Modal_Product_Qty" onClick={() => { setActiveModal(0) }}>
            <div className="content animate__animated animate__fadeInDown">
                <table className="col-12 table table-bordered table-dark">
                    <thead>
                        <tr onClick={() => { event.stopPropagation() }}>
                            <th>-</th>
                            <th>Location</th>
                            <th>Qty</th>
                            <th>unit</th>
                            <th>Aircraft S/N</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            qtyDetailed.map((el, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{el.location_name}</td>
                                        <td>{el.qty_value}</td>
                                        <td>{el.unit_name}</td>
                                        <td>{el.aircraft_serial_no}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div >
    )
}
