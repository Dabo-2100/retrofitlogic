import { useEffect, useState } from "react";
import "./index.scss";
import Logo from "@/assets/Orignal-Logo.png";
import { $FormData, $Resizer } from "../../../store";
import { useRecoilState } from "recoil";
export default function Form_1001() {
    const makeSheetNo = (no) => {
        let L = String(no).length;
        let final = "";
        for (let index = 0; index < (4 - L); index++) {
            final += "0";
        }
        final += String(no);
        return final;
    }

    const makeAirframeHrs = (no) => {
        let L = String(no).split(".")[0].split("").length;
        let final = "";
        for (let index = 0; index < (4 - L); index++) {
            final += "0";
        }
        final += String(no);
        return final;
    }
    const [, SetResizer] = useRecoilState($Resizer);
    const openResizer = (event) => {
        event.preventDefault();
        let el = event.target;
        let obj = {
            index: 1,
            element: el,
        }
        if (el.tagName.toLowerCase() == "input" || el.tagName.toLowerCase() == "textarea") {
            SetResizer(obj);
        }
    }
    const closeResizer = () => {
        let obj = {
            index: 0,
            el: null,
        }
        SetResizer(obj);
    }
    const [data] = useState([1, 2, 3, 4, 5]);

    const [formData] = useRecoilState($FormData);

    useEffect(() => {
        if (formData.formRows.length != 0) {
            // alert('data will be render');
            // // document.querySelectorAll("#Form_1001 input");
        }
    }, [])

    return (
        <div id="Form_1001" className="animate__animated animate__fadeIn" onContextMenu={openResizer} onClick={(e) => { e.stopPropagation(); closeResizer() }}>
            <div className="formHeader col-12">
                <div className="leftSection col-3 align-items-center">
                    <div className="col-12 Row" style={{ border: "solid  2px black" }}>
                        <label className="col-3">Type</label>
                        <input className="col-9" style={{ borderTop: 0, borderBottom: 0 }} readOnly value={"AW-149"} />
                    </div>
                    <div className="col-12 Row d-flex justify-content-between"
                    // style={{ border: " 2px solid black" }}
                    >
                        <div className="col-4 d-flex" style={{ border: " 2px solid black" }}>
                            <label className="col-4" style={{ borderRightWidth: " 2px", borderBottomWidth: 0 }}>MK</label>
                            <input className="col-8" style={{ borderTopWidth: 0, borderBottomWidth: 0 }} />
                        </div>
                        <div className="col-7">
                            <label className="col-2" style={{ border: " 2px solid black", borderRightWidth: 0, }}>S/N</label>
                            {
                                formData.formInfo.aircraft_sn != null ?
                                    <>
                                        <input className="col-2" maxLength="1" readOnly value={formData.formInfo.aircraft_sn[0]} />
                                        <input className="col-2" maxLength="1" readOnly value={formData.formInfo.aircraft_sn[1]} />
                                        <input className="col-2" maxLength="1" readOnly value={formData.formInfo.aircraft_sn[2]} />
                                        <input className="col-2" maxLength="1" readOnly value={formData.formInfo.aircraft_sn[3]} />
                                        <input className="col-2" maxLength="1" readOnly value={formData.formInfo.aircraft_sn[4]} style={{ borderRightWidth: "2px" }} />
                                    </>
                                    : <>
                                        <input className="col-2" maxLength="1" />
                                        <input className="col-2" maxLength="1" />
                                        <input className="col-2" maxLength="1" />
                                        <input className="col-2" maxLength="1" />
                                        <input className="col-2" maxLength="1" style={{ borderRightWidth: "2px" }} />
                                    </>
                            }


                        </div>
                    </div>
                </div>
                <div className="centerSection col-5 d-flex align-items-center">
                    <h1 className="col-12">Aircraft Maintenance Log</h1>
                </div>
                <div className="rightSection col-2">
                    <img src={Logo} />
                    <div className="col-12 d-flex justify-content-end">
                        <div className="sheetNo col-12">
                            <label className="col-4" style={{ border: "2px solid black", borderRightWidth: 0 }}>Sheet No</label>
                            {
                                formData.formInfo.sheet_no != null ?
                                    <>
                                        <input type="text" className="col-2" maxLength="1" readOnly value={formData.formInfo.sheet_no[0]} />
                                        <input type="text" className="col-2" maxLength="1" readOnly value={formData.formInfo.sheet_no[1]} />
                                        <input type="text" className="col-2" maxLength="1" readOnly value={formData.formInfo.sheet_no[2]} />
                                        <input type="text" className="col-2" maxLength="1" style={{ borderRightWidth: "2px" }} readOnly value={formData.formInfo.sheet_no[3]} />

                                    </>
                                    : <>
                                        <input type="text" className="col-2" maxLength="1" />
                                        <input type="text" className="col-2" maxLength="1" />
                                        <input type="text" className="col-2" maxLength="1" />
                                        <input type="text" className="col-2" maxLength="1" style={{ borderRightWidth: "2px" }} />
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="formBody col-12 pb-0">
                <table className="table table-bordered col-12 mb-0">
                    <thead>
                        <tr>
                            <th colSpan={2} style={{ fontWeight: 600 }}>Fault Report / Work Required</th>
                            <th style={{ fontWeight: 600 }}>Action Taken</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((row, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="col-2 p-0">
                                            <div className="col-12 cNo d-flex justify-content-between p-0" style={{ fontSize: "10px" }}>
                                                <label className="col-4 py-1">{ }</label>
                                                <div className="col-7 d-flex">
                                                    {
                                                        formData.formRows[index] ? makeSheetNo(+formData.formRows[index].control_no).split("").map((el, index) => {
                                                            return <input key={index} className="col-3" maxLength={1} style={{ borderTop: 0, borderBottom: 0 }} readOnly value={el} disabled={true}></input>
                                                        }) : <>
                                                            <input className="col-3" maxLength={1} style={{ borderTop: 0, borderBottom: 0 }}></input>
                                                            <input className="col-3" maxLength={1} style={{ borderTop: 0, borderBottom: 0 }}></input>
                                                            <input className="col-3" maxLength={1} style={{ borderTop: 0, borderBottom: 0 }}></input>
                                                            <input className="col-3" maxLength={1} style={{ borderTop: 0, borderBottom: 0 }}></input>
                                                        </>
                                                    }

                                                </div>
                                            </div>
                                            <div className="col-12 d-flex flex-wrap" style={{ fontSize: "12px", borderTop: " 2px solid black" }}>
                                                <label className="col-12 py-1" style={{ borderBottom: " 2px solid black", fontWeight: "600" }}>Originator’s Printed Name</label>
                                                <div className="col-12 p-0">
                                                    {
                                                        formData.formRows[index] ?
                                                            <input className="col-12" style={{ height: "48px", textAlign: "center", border: 0, fontSize: "1rem" }} readOnly value={formData.formRows[index].originator_name} disabled={true} /> :
                                                            <input className="col-12" style={{ height: "48px", textAlign: "center", border: 0, fontSize: "1rem" }} />
                                                    }
                                                    {/* <input className="col-12" style={{ height: "48px", textAlign: "center", border: 0, fontSize: "1rem" }} /> */}
                                                </div>
                                            </div>
                                            <div className="col-12 d-flex px-3 gap-1 justify-content-start align-items-center" style={{ fontSize: "12px", borderTop: " 2px solid black" }}>
                                                <label className="py-1">1002</label>
                                                <input type="checkbox" />
                                            </div>
                                        </td>
                                        <td className="col-6 p-0">
                                            <div className="col-12 d-flex">
                                                <div className="col-9 d-flex justify-content-between" style={{
                                                    border: " 2px solid black",
                                                    fontSize: "10px",
                                                    borderLeft: 0,
                                                    borderTop: 0,
                                                }}>
                                                    <div className="col-4 d-flex date">
                                                        <label className="col-4 py-1" style={{ borderTop: 0, borderBottom: 0 }}>Date</label>
                                                        <div className="col-8 d-flex">
                                                            {
                                                                formData.formRows[index] ?
                                                                    <>

                                                                        <input className="col-2" style={{ borderTop: 0, borderBottom: 0 }} maxLength="1" readOnly value={formData.formRows[index].log_date.split("-")[2].split("")[0]} />
                                                                        <input className="col-2" style={{ borderTop: 0, borderBottom: 0 }} maxLength="1" readOnly value={formData.formRows[index].log_date.split("-")[2].split("")[1]} />
                                                                        <input className="col-2" style={{ borderTop: 0, borderBottom: 0 }} maxLength="1" readOnly value={formData.formRows[index].log_date.split("-")[1].split("")[0]} />
                                                                        <input className="col-2" style={{ borderTop: 0, borderBottom: 0 }} maxLength="1" readOnly value={formData.formRows[index].log_date.split("-")[1].split("")[1]} />
                                                                        <input className="col-2" style={{ borderTop: 0, borderBottom: 0 }} maxLength="1" readOnly value={formData.formRows[index].log_date.split("-")[0].split("")[2]} />
                                                                        <input className="col-2" style={{ border: "2px solid black", borderTopWidth: 0, borderBottomWidth: 0, }} readOnly value={formData.formRows[index].log_date.split("-")[0].split("")[3]} maxLength="1" />
                                                                    </> :
                                                                    <>
                                                                        <input className="col-2" style={{ borderTop: 0, borderBottom: 0 }} maxLength="1" />
                                                                        <input className="col-2" style={{ borderTop: 0, borderBottom: 0 }} maxLength="1" />
                                                                        <input className="col-2" style={{ borderTop: 0, borderBottom: 0 }} maxLength="1" />
                                                                        <input className="col-2" style={{ borderTop: 0, borderBottom: 0 }} maxLength="1" />
                                                                        <input className="col-2" style={{ borderTop: 0, borderBottom: 0 }} maxLength="1" />
                                                                        <input className="col-2" style={{ border: "2px solid black", borderTopWidth: 0, borderBottomWidth: 0, }} maxLength="1" />
                                                                    </>
                                                            }

                                                        </div>
                                                    </div>
                                                    <div className="col-6 d-flex afHrs ">
                                                        <label className="col-4 py-1" style={{
                                                            border: "2px solid black",
                                                            borderRightWidth: 0,
                                                            borderTopWidth: 0,
                                                            borderBottomWidth: 0
                                                        }}>AF/Hrs</label>
                                                        <div className="col-8 d-flex">
                                                            <input maxLength="1" style={{ borderTop: 0, borderBottom: 0 }} />
                                                            <input maxLength="1" style={{ borderTop: 0, borderBottom: 0 }} />
                                                            <input maxLength="1" style={{ borderTop: 0, borderBottom: 0 }} />
                                                            <input maxLength="1" style={{ borderTop: 0, borderBottom: 0 }} />
                                                            <input maxLength="1" style={{ borderTop: 0, borderBottom: 0 }} />
                                                            <input maxLength="1" style={{ borderTop: 0, borderBottom: 0 }} />
                                                            <input maxLength="1" style={{ borderTop: 0, borderBottom: 0 }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 d-flex flex-wrap" style={{ fontSize: "12px" }}>
                                                <label className="col-12 text-start p-1">Symptom / Work Required:</label>


                                                {
                                                    formData.formRows[index] ?
                                                        <textarea className="col-12" style={{
                                                            height: "72px",
                                                            resize: "none",
                                                            border: "2px solid black",
                                                            borderBottomWidth: 0,
                                                            borderLeftWidth: 0,
                                                            borderRightWidth: 0,
                                                        }} value={formData.formRows[index].work_required} readOnly></textarea> :
                                                        <textarea className="col-12" style={{
                                                            height: "72px",
                                                            resize: "none",
                                                            border: "2px solid black",
                                                            borderBottomWidth: 0,
                                                            borderLeftWidth: 0,
                                                            borderRightWidth: 0,
                                                        }}></textarea>
                                                }

                                            </div>
                                        </td>
                                        <td className="col-4 p-0">
                                            <div className="col-12 d-flex flex-wrap">
                                                {
                                                    formData.formRows[index] ?
                                                        <textarea className="col-12" readOnly value={formData.formRows[index].action_taken} style={{
                                                            height: "87px",
                                                            resize: "none",
                                                            border: 0,
                                                            borderBottom: " 2px solid black"
                                                        }}></textarea>
                                                        :
                                                        <textarea className="col-12" style={{
                                                            height: "87px",
                                                            resize: "none",
                                                            border: 0,
                                                            borderBottom: " 2px solid black"
                                                        }}></textarea>
                                                }
                                                <div className="col-12 d-flex" style={{ fontSize: "10px" }}>
                                                    <label className="col-5 p-2" >Supervisor Printed Name:</label>

                                                    {
                                                        formData.formRows[index] ? <input className="col-7 text-center" style={{ borderTop: 0, borderBottom: 0, fontSize: "14px" }} disabled={true} readOnly value={formData.formRows[index].supervisor_name} /> :
                                                            <input className="col-7 text-center" style={{ borderTop: 0, borderBottom: 0, fontSize: "14px" }} />
                                                    }
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
            </div>
            <div className="formFooter col-12 d-flex justify-content-end" style={{ paddingRight: "2rem" }}>
                <label className="py-2" style={{ color: "red" }}>IPACO Form 1001</label>
            </div>
        </div>
    )
}
