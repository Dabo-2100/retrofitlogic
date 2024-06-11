import { useRecoilState } from "recoil";
import { $Server, $Token, $ActiveModal, $ActiveForm, $openedAircraft_id, $LoaderIndex, $FormData, $openedForm } from "@/store";
import { useEffect, useState } from "react";
import icon1001 from "@/assets/1001_icon.png";
import icon1002 from "@/assets/1002_icon.png";
import icon1003 from "@/assets/1003_icon.png";
import icon1004 from "@/assets/1004_icon.png";
import newDocIcon from "@/assets/new-document.png"
import Swal from "sweetalert2";
import axios from "axios";

export default function FolderRoute() {
    const [Server_Url] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [aircraft_id] = useRecoilState($openedAircraft_id);
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);
    const [, setFormData] = useRecoilState($FormData);
    const [, setActiveModal] = useRecoilState($ActiveModal);
    const [, setActiveForm] = useRecoilState($ActiveForm);
    const [, setOpenForm] = useRecoilState($openedForm);

    const [folderNo] = useState(6);
    const [formTypes, setFormTypes] = useState([]);
    const [allForms, setAllForms] = useState([]);
    const [formsToView, setFormsToView] = useState([]);

    function groupBy(array, property) {
        return array.reduce((groups, item) => {
            const value = item[property];
            if (!groups[value]) {
                groups[value] = [];
            }
            groups[value].push(item);
            return groups;
        }, {});
    }

    function makeArray(no) {
        let res = [];
        for (let index = 0; index < no; index++) {
            res.push(index + 1);
        }
        return res;
    }

    function makeSheetNo(no) {
        let L = String(no).length;
        let final = "";
        for (let index = 0; index < (4 - L); index++) {
            final += "0";
        }
        final += String(no);
        return final;
    }

    const getAircraftForms = (aircraft_id) => {
        setLoaderIndex(1);
        axios.get(`${Server_Url}/php/index.php/api/aircrafts/${aircraft_id}/forms`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {
            if (res.data.err == false) {
                let x = res.data.data;
                let y = groupBy(x, 'type_name');
                let z = Object.keys(y);
                let final = [];
                z.forEach((type) => {
                    let p = Math.ceil(y[type].length / folderNo);
                    let obj = {
                        name: type,
                        pages: makeArray(p),
                        activeIndex: 0,
                    }
                    final.push(obj);
                })
                setFormTypes(final);
                setAllForms(y);
                setFormsToView(y);
                setTimeout(() => {
                    setLoaderIndex(0);
                }, 500);
            }
            else {
                Swal.fire({
                    icon: "info",
                    text: "There is no forms here",
                    timer: 1500,
                })
                setTimeout(() => {
                    setLoaderIndex(0);
                }, 500);
            }
        }).catch((err) => {
            Swal.fire({
                icon: "Error",
                text: "Connection Error !",
                timer: 1500,
            })
        });

    }

    const createNewForm = (form_type) => {
        alert('create' + allForms[form_type][0].form_type_id);
    }

    const chagePage = (form_type, toPage) => {
        let oldView = { ...formsToView };
        let y = allForms[form_type].slice(((toPage - 1) * folderNo), (toPage * folderNo))
        oldView[form_type] = y;
        setFormsToView(oldView);
        console.log(allForms);

    }

    const openFormDetails = (form_id, sheetNo, form_type) => {
        let formObj = {
            form_id: form_id,
            form_type: form_type,
        }
        setOpenForm(formObj);
        axios.get(`${Server_Url}/php/index.php/api/forms/${form_id}/logs`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {
            if (res.data.err == false) {
                let dataObj = {
                    formInfo: {
                        sheet_no: sheetNo,
                        aircraft_sn: "49064"
                    },
                    formRows: res.data.data,
                }
                setFormData(dataObj);
                setActiveModal(1000);
                if (form_type == 1) {
                    setActiveForm(1001);
                }
                else if (form_type == 2) {
                    setActiveForm(1002);
                }
                else if (form_type == 3) {
                    setActiveForm(1003);
                }
            }
            else {
                console.log(res.data);
                Swal.fire({
                    icon: "error",
                    text: "There is no logs here",
                    timer: 1000,
                })
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        getAircraftForms(aircraft_id);
    }, []);

    return (
        <div className="col-12 d-flex flex-wrap gap-3" id="FolderRoute">
            {
                formTypes.map((type, index) => {
                    return (
                        <div className="formType col-12" key={index}>

                            <div className="col-12 d-flex align-items-center justify-content-between mb-2 gap-2">
                                <h1 className="typeHeader">{type.name}</h1>
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="p-3"
                                        onClick={() => { createNewForm(type.name) }}
                                        style={{ backgroundColor: "#1f2935", cursor: "pointer", borderRadius: "50%" }}
                                    >
                                        <img src={newDocIcon} width={25} />
                                    </div>
                                    <input type="search" placeholder={`Search ${type.name} ...`} />
                                </div>
                            </div>

                            <div className="col-12 formsContainer">
                                {
                                    formsToView[type.name].map((sheet, index) => {
                                        if (index + 1 <= folderNo) {
                                            return (
                                                <div key={index} className={`folder`} onClick={() => {
                                                    openFormDetails(sheet.form_id, makeSheetNo(sheet.form_order), sheet.form_type_id);
                                                    // console.log(sheet)
                                                }}>
                                                    <img src={
                                                        type == 'Form 1001' ? icon1001 :
                                                            type == 'Form 1002' ? icon1002 :
                                                                type == 'Form 1003' ? icon1003 :
                                                                    icon1004
                                                    } />
                                                    <p>{makeSheetNo(sheet.form_order)}</p>
                                                </div>
                                            )

                                        }
                                    })
                                }
                                <div className="col-12 pagination d-flex justify-content-center gap-2">
                                    {
                                        type.pages.length > 1 ? (
                                            type.pages.map((page, index) => {
                                                return (<button onClick={() => { chagePage(type.name, page); }} key={index} className={`btn btn-${type.activeIndex == index ? 'info' : 'primary'}`}>{page}</button>)
                                            })

                                        ) : null
                                    }
                                </div>
                            </div>
                            <hr className="col-12" />
                        </div>
                    )
                })
            }
        </div>
    )
}