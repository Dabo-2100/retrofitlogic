import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { useRecoilState } from "recoil";
import { $Token, $Server } from "../../../../store";
import Swal from "sweetalert2";
import { icon } from "@fortawesome/fontawesome-svg-core";

export default function ItemForm() {
    const [Server_Url] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [warehouseUnits, setWarehouseUnits] = useState([]);
    const [warehouseCats, setWarehouseCats] = useState([]);
    const [pnErr, setPnErr] = useState(false);
    const item_pn = useRef(null);
    const item_name = useRef(null);
    const item_usa_pn = useRef(null);
    const item_category = useRef(null);
    const upload = useRef();




    const getUnits = () => {
        let warehouse_id = 1;
        axios.get(`${Server_Url}/php/index.php/api/warehouse/units/${warehouse_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((Res) => {
            let res = Res.data;
            console.log(res);
            if (!res.err) {
                setWarehouseUnits(res.data.units);
                setWarehouseCats(res.data.cats);
            }
            else {
                setWarehouseUnits([]);
                setWarehouseCats([]);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const handelSubmit = () => {
        event.preventDefault();
        axios.post(`${Server_Url}/php/index.php/api/warehouse/products/store`,
            {
                product_pn: item_pn.current.value,
                product_name: item_name.current.value,
                product_usa_pn: item_usa_pn.current.value,
                category_id: item_category.current.value,
                warehouse_id: 1,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then((Res) => {
                let res = Res.data;
                console.log(res);
                if (!res.err) {
                    Swal.fire({
                        icon: "success",
                        text: "Item Added Successfuly !",
                        timer: 1500
                    })
                }
            }).catch((err) => {
                console.log(err);
            })
    }

    const checkPN = () => {
        axios.post(`${Server_Url}/php/index.php/api/warehouse/products`,
            {
                warehouse_id: 1,
                search_value: event.target.value,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then((Res) => {
                let res = Res.data;
                // console.log(res);
                if (!res.err && res.data.length > 0) {
                    let pIndex = res.data.findIndex((el) => {
                        setPnErr(true);
                        if ((el.product_pn.toLowerCase() == item_pn.current.value.toLowerCase())) {
                            Swal.fire({
                                icon: "error",
                                text: "This PN is already exist in your warehouse",
                                timer: 1500
                            })
                        }
                        else if ((el.product_usa_pn.toLowerCase() == item_usa_pn.current.value.toLowerCase())) {
                            Swal.fire({
                                icon: "error",
                                text: "This USA P/N is already exist in your warehouse",
                                timer: 1500
                            })
                        }
                        else {
                            setPnErr(false);
                        }
                    });
                }
            }).catch((err) => {
                console.log(err);
            })
    }

    const [file, setFile] = useState();
    const uploadFile = () => {

        const formData = new FormData();
        formData.append('file', file);
        formData.append('warehouse_id', 1);

        axios.post(`${Server_Url}/php/index.php/upload/files/items`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    useEffect(() => {
        getUnits();
    }, []);
    return (
        <div className="col-12 container d-flex flex-column align-items-center gap-3 justify-content-center pt-5" >
            <div className="btn btn-primary">
                <input type="file" ref={upload} onChange={() => { setFile(upload.current.files[0]) }} />
                <button className="btn btn-success" onClick={uploadFile}>upload</button>
            </div>

            <form className='ItemForm' onSubmit={handelSubmit}>
                <h1 className='col-12'>Add New Item</h1>
                <div className="col-12 formField">
                    <label htmlFor="itemPN">Item P/N</label>
                    <input onKeyUp={checkPN} ref={item_pn} className='col-12 form-control' id="itemPN" placeholder='Enter item name here ... ' required />
                </div>
                <div className="col-12 formField">
                    <label htmlFor="itemName">Item Name</label>
                    <input ref={item_name} className='col-12 form-control' id="itemName" placeholder='Enter item name here ...' required />
                </div>
                <div className="col-12 formField">
                    <label htmlFor="itemUsaPN">Item USA P/N</label>
                    <input onChange={checkPN} ref={item_usa_pn} className='col-12 form-control' id="itemUsaPN" placeholder='Enter item name here ...' required />
                </div>
                <div className="col-12 formField">
                    <label htmlFor="itemCategory">Item Units</label>
                    <select ref={item_category} className="col-12 form-select" >
                        <option value="-1" hidden={true} disabled={true}>Select item unit</option>
                        {
                            warehouseCats.map((el) => {
                                return (
                                    <option key={el.category_id} value={el.category_id}>{el.category_name}</option>

                                )
                            })
                        }
                    </select>
                </div>
                <button className="col-12 btn btn-success" disabled={pnErr}>Add New</button>
            </form>
        </div>
    )
}
