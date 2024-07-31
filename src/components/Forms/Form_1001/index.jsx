import { useContext, useEffect, useState } from "react";
import "./index.scss";
import Logo from "@/assets/New_Logo.png";
import { FormContext } from "@/Apps/Aircraft_Forms/FormContext";
import { db } from "@/Firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Form_1001() {
  const makeSheetNo = (no) => {
    let L = String(no).length;
    let final = "";
    for (let index = 0; index < 4 - L; index++) {
      final += "0";
    }
    final += String(no);
    return final;
  };
  const makeArr = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };
  const makeAirframeHrs = (no) => {
    let L = String(no).split(".")[0].split("").length;
    let final = "";
    for (let index = 0; index < 4 - L; index++) {
      final += "0";
    }
    final += String(no);
    return final;
  };

  const {
    setResizer: SetResizer,
    formData,
    activeAircraft,
    aircraftData,
  } = useContext(FormContext);

  const openResizer = (event) => {
    event.preventDefault();
    let el = event.target;
    let obj = {
      index: 1,
      element: el,
    };
    if (
      el.tagName.toLowerCase() == "input" ||
      el.tagName.toLowerCase() == "textarea"
    ) {
      SetResizer(obj);
    }
  };
  const closeResizer = () => {
    let obj = {
      index: 0,
      el: null,
    };
    SetResizer(obj);
  };

  const [controls, setControls] = useState([]);

  const getFormControls = async (sheetNo) => {
    let final = [];
    let end = sheetNo * 5;
    let start = end - 4;

    for (let index = start; index <= end; index++) {
      const docRef = doc(
        db,
        `Aircrafts/${activeAircraft}/Form_1001/${sheetNo}/Controls/`,
        `${index}`
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let obj = { ...docSnap.data(), id: docSnap.id };
        final.push(obj);
      } else {
        break;
      }
    }

    if (final.length == 0) {
      let arr = makeArr(start, end);
      final = arr.map((el) => {
        return { id: el };
      });
    } else {
      let control_no = start - 1;
      let last = start - 1;
      let res = [];
      for (let index = 1; index <= 5; index++) {
        control_no = final[index - 1] ? final[index - 1].id : last;
        if (control_no != 0 && control_no != last) {
          res.push(final[index - 1]);
          last = control_no;
        } else {
          res.push({ id: ++last });
        }
      }
      final = res;
    }
    console.log(final);
    setControls(final);
  };
  const open1002 = (control_no) => {
    alert(`i will open ${control_no} and i'm Sheet ${+formData.sheet_no}`);
  };
  useEffect(() => {
    getFormControls(+formData.sheet_no);
  }, []);

  return (
    <div
      id="Form_1001"
      className="animate__animated animate__fadeIn"
      onContextMenu={openResizer}
      onClick={(e) => {
        e.stopPropagation();
        closeResizer();
      }}
    >
      <div className="formHeader col-12">
        <div className="leftSection col-3 align-items-center">
          <div className="col-12 Row" style={{ border: "solid  2px black" }}>
            <label className="col-3">Type</label>
            {aircraftData.aircraft_type ? (
              <input
                className="col-9"
                style={{ borderTop: 0, borderBottom: 0 }}
                value={aircraftData.aircraft_type}
                readOnly
              />
            ) : (
              <input
                className="col-9"
                style={{ borderTop: 0, borderBottom: 0 }}
              />
            )}
          </div>

          <div className="col-12 Row d-flex justify-content-between">
            <div
              className="col-4 d-flex"
              style={{ border: " 2px solid black" }}
            >
              <label
                className="col-4"
                style={{ borderRightWidth: " 2px", borderBottomWidth: 0 }}
              >
                MK
              </label>
              {aircraftData.mk_no ? (
                <input
                  className="col-8"
                  style={{ borderTopWidth: 0, borderBottomWidth: 0 }}
                  value={aircraftData.mk_no}
                  readOnly
                />
              ) : (
                <input
                  className="col-8"
                  style={{ borderTopWidth: 0, borderBottomWidth: 0 }}
                />
              )}
            </div>
            <div className="col-7">
              <label
                className="col-2"
                style={{ border: " 2px solid black", borderRightWidth: 0 }}
              >
                S/N
              </label>
              {activeAircraft != null ? (
                <>
                  <input
                    className="col-2"
                    maxLength="1"
                    readOnly
                    value={activeAircraft.split("")[0]}
                  />
                  <input
                    className="col-2"
                    maxLength="1"
                    readOnly
                    value={activeAircraft.split("")[1]}
                  />
                  <input
                    className="col-2"
                    maxLength="1"
                    readOnly
                    value={activeAircraft.split("")[2]}
                  />
                  <input
                    className="col-2"
                    maxLength="1"
                    readOnly
                    value={activeAircraft.split("")[3]}
                  />
                  <input
                    className="col-2"
                    maxLength="1"
                    readOnly
                    value={activeAircraft.split("")[4]}
                    style={{ borderRightWidth: "2px" }}
                  />
                </>
              ) : (
                <>
                  <input className="col-2" maxLength="1" />
                  <input className="col-2" maxLength="1" />
                  <input className="col-2" maxLength="1" />
                  <input className="col-2" maxLength="1" />
                  <input
                    className="col-2"
                    maxLength="1"
                    style={{ borderRightWidth: "2px" }}
                  />
                </>
              )}
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
              <label
                className="col-4"
                style={{ border: "2px solid black", borderRightWidth: 0 }}
              >
                Sheet No
              </label>
              {formData.sheet_no ? (
                <>
                  <input
                    type="text"
                    className="col-2"
                    maxLength="1"
                    readOnly
                    value={formData.sheet_no.split("")[0]}
                  />
                  <input
                    type="text"
                    className="col-2"
                    maxLength="1"
                    readOnly
                    value={formData.sheet_no.split("")[1]}
                  />
                  <input
                    type="text"
                    className="col-2"
                    maxLength="1"
                    readOnly
                    value={formData.sheet_no.split("")[2]}
                  />
                  <input
                    type="text"
                    className="col-2"
                    maxLength="1"
                    style={{ borderRightWidth: "2px" }}
                    readOnly
                    value={formData.sheet_no.split("")[3]}
                  />
                </>
              ) : (
                <>
                  <input type="text" className="col-2" maxLength="1" />
                  <input type="text" className="col-2" maxLength="1" />
                  <input type="text" className="col-2" maxLength="1" />
                  <input
                    type="text"
                    className="col-2"
                    maxLength="1"
                    style={{ borderRightWidth: "2px" }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="formBody col-12 pb-0">
        <table className="table table-bordered col-12 mb-0">
          <thead>
            <tr>
              <th colSpan={2} style={{ fontWeight: 600 }}>
                Fault Report / Work Required
              </th>
              <th style={{ fontWeight: 600 }}>Action Taken</th>
            </tr>
          </thead>
          <tbody>
            {controls.map((row, index) => {
              return (
                <tr key={index}>
                  <td className="col-2 p-0">
                    <div
                      className="col-12 cNo d-flex justify-content-between p-0"
                      style={{ fontSize: "10px" }}
                    >
                      <label className="col-4 py-1">Control No</label>
                      <div className="col-7 d-flex">
                        {row.id ? (
                          makeSheetNo(+row.id)
                            .split("")
                            .map((el, index) => {
                              return (
                                <input
                                  key={index}
                                  className="col-3"
                                  maxLength={1}
                                  style={{ borderTop: 0, borderBottom: 0 }}
                                  readOnly
                                  value={el}
                                  disabled={true}
                                ></input>
                              );
                            })
                        ) : (
                          <>
                            <input
                              className="col-3"
                              maxLength={1}
                              style={{ borderTop: 0, borderBottom: 0 }}
                            ></input>
                            <input
                              className="col-3"
                              maxLength={1}
                              style={{ borderTop: 0, borderBottom: 0 }}
                            ></input>
                            <input
                              className="col-3"
                              maxLength={1}
                              style={{ borderTop: 0, borderBottom: 0 }}
                            ></input>
                            <input
                              className="col-3"
                              maxLength={1}
                              style={{ borderTop: 0, borderBottom: 0 }}
                            ></input>
                          </>
                        )}
                      </div>
                    </div>
                    <div
                      className="col-12 d-flex flex-wrap"
                      style={{
                        fontSize: "12px",
                        borderTop: " 2px solid black",
                      }}
                    >
                      <label
                        className="col-12 py-1"
                        style={{
                          borderBottom: " 2px solid black",
                          fontWeight: "600",
                        }}
                      >
                        Originator’s Printed Name
                      </label>
                      <div className="col-12 p-0">
                        {row.originator_name ? (
                          <input
                            className="col-12"
                            style={{
                              height: "46px",
                              textAlign: "center",
                              border: 0,
                              fontSize: "1rem",
                            }}
                            readOnly
                            value={row.originator_name}
                            disabled={true}
                          />
                        ) : (
                          <input
                            className="col-12"
                            style={{
                              height: "46px",
                              textAlign: "center",
                              border: 0,
                              fontSize: "1rem",
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div
                      className="col-12 d-flex px-3 gap-1 justify-content-start align-items-center"
                      style={{
                        fontSize: "12px",
                        borderTop: " 2px solid black",
                      }}
                    >
                      <label
                        className="py-1"
                        onClick={() => {
                          open1002(+row.id);
                        }}
                      >
                        1002
                      </label>
                      <input type="checkbox" defaultChecked={row.has_1002} />
                    </div>
                  </td>
                  <td className="col-6 p-0">
                    <div className="col-12 d-flex">
                      <div
                        className="col-9 d-flex justify-content-between"
                        style={{
                          border: " 2px solid black",
                          fontSize: "10px",
                          borderLeft: 0,
                          borderTop: 0,
                        }}
                      >
                        <div className="col-4 d-flex date">
                          <label
                            className="col-4 py-1"
                            style={{ borderTop: 0, borderBottom: 0 }}
                          >
                            Date
                          </label>
                          <div className="col-8 d-flex">
                            {row.control_date ? (
                              <>
                                <input
                                  className="col-2"
                                  style={{ borderTop: 0, borderBottom: 0 }}
                                  maxLength="1"
                                  readOnly
                                  value={
                                    row.control_date.split("-")[2].split("")[0]
                                  }
                                />

                                <input
                                  className="col-2"
                                  style={{ borderTop: 0, borderBottom: 0 }}
                                  maxLength="1"
                                  readOnly
                                  value={
                                    row.control_date.split("-")[2].split("")[1]
                                  }
                                />
                                <input
                                  className="col-2"
                                  style={{ borderTop: 0, borderBottom: 0 }}
                                  maxLength="1"
                                  readOnly
                                  value={
                                    row.control_date.split("-")[1].split("")[0]
                                  }
                                />
                                <input
                                  className="col-2"
                                  style={{ borderTop: 0, borderBottom: 0 }}
                                  maxLength="1"
                                  readOnly
                                  value={
                                    row.control_date.split("-")[1].split("")[1]
                                  }
                                />
                                <input
                                  className="col-2"
                                  style={{ borderTop: 0, borderBottom: 0 }}
                                  maxLength="1"
                                  readOnly
                                  value={
                                    row.control_date.split("-")[0].split("")[2]
                                  }
                                />
                                <input
                                  className="col-2"
                                  style={{
                                    border: "2px solid black",
                                    borderTopWidth: 0,
                                    borderBottomWidth: 0,
                                  }}
                                  readOnly
                                  value={
                                    row.control_date.split("-")[0].split("")[3]
                                  }
                                  maxLength="1"
                                />
                              </>
                            ) : (
                              <>
                                <input
                                  className="col-2"
                                  style={{ borderTop: 0, borderBottom: 0 }}
                                  maxLength="1"
                                />
                                <input
                                  className="col-2"
                                  style={{ borderTop: 0, borderBottom: 0 }}
                                  maxLength="1"
                                />
                                <input
                                  className="col-2"
                                  style={{ borderTop: 0, borderBottom: 0 }}
                                  maxLength="1"
                                />
                                <input
                                  className="col-2"
                                  style={{ borderTop: 0, borderBottom: 0 }}
                                  maxLength="1"
                                />
                                <input
                                  className="col-2"
                                  style={{ borderTop: 0, borderBottom: 0 }}
                                  maxLength="1"
                                />
                                <input
                                  className="col-2"
                                  style={{
                                    border: "2px solid black",
                                    borderTopWidth: 0,
                                    borderBottomWidth: 0,
                                  }}
                                  maxLength="1"
                                />
                              </>
                            )}
                          </div>
                        </div>
                        <div className="col-6 d-flex afHrs ">
                          <label
                            className="col-4 py-1"
                            style={{
                              border: "2px solid black",
                              borderRightWidth: 0,
                              borderTopWidth: 0,
                              borderBottomWidth: 0,
                            }}
                          >
                            AF/Hrs
                          </label>
                          <div className="col-8 d-flex">
                            <input
                              maxLength="1"
                              style={{ borderTop: 0, borderBottom: 0 }}
                            />
                            <input
                              maxLength="1"
                              style={{ borderTop: 0, borderBottom: 0 }}
                            />
                            <input
                              maxLength="1"
                              style={{ borderTop: 0, borderBottom: 0 }}
                            />
                            <input
                              maxLength="1"
                              style={{ borderTop: 0, borderBottom: 0 }}
                            />
                            <input
                              maxLength="1"
                              style={{ borderTop: 0, borderBottom: 0 }}
                            />
                            <input
                              maxLength="1"
                              style={{ borderTop: 0, borderBottom: 0 }}
                            />
                            <input
                              maxLength="1"
                              style={{ borderTop: 0, borderBottom: 0 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-12 d-flex flex-wrap"
                      style={{ fontSize: "12px" }}
                    >
                      <label className="col-12 text-start p-1">
                        Symptom / Work Required:
                      </label>

                      {row.work_required ? (
                        <textarea
                          className="col-12"
                          style={{
                            height: "70px",
                            resize: "none",
                            border: "2px solid black",
                            borderBottomWidth: 0,
                            borderLeftWidth: 0,
                            borderRightWidth: 0,
                          }}
                          value={row.work_required}
                          readOnly
                        ></textarea>
                      ) : (
                        <textarea
                          className="col-12"
                          style={{
                            height: "70px",
                            resize: "none",
                            border: "2px solid black",
                            borderBottomWidth: 0,
                            borderLeftWidth: 0,
                            borderRightWidth: 0,
                          }}
                        ></textarea>
                      )}
                    </div>
                  </td>
                  <td className="col-4 p-0">
                    <div className="col-12 d-flex flex-wrap">
                      {row.work_done ? (
                        <textarea
                          className="col-12"
                          readOnly
                          value={row.work_done}
                          style={{
                            height: "88px",
                            resize: "none",
                            border: 0,
                            borderBottom: " 2px solid black",
                          }}
                        ></textarea>
                      ) : (
                        <textarea
                          className="col-12"
                          style={{
                            height: "88px",
                            resize: "none",
                            border: 0,
                            borderBottom: " 2px solid black",
                          }}
                        ></textarea>
                      )}
                      <div
                        className="col-12 d-flex"
                        style={{ fontSize: "8px" }}
                      >
                        <p className="col-5 p-2 mb-0">
                          Supervisor Printed Name:
                        </p>
                        {row.supervisor_name ? (
                          <input
                            className="col-7 text-center"
                            style={{
                              borderTop: 0,
                              borderBottom: 0,
                              fontSize: "14px",
                            }}
                            disabled={true}
                            readOnly
                            value={row.supervisor_name}
                          />
                        ) : (
                          <input
                            className="col-7 text-center"
                            style={{
                              borderTop: 0,
                              borderBottom: 0,
                              fontSize: "14px",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div
        className="formFooter col-12 d-flex justify-content-end"
        style={{ paddingRight: "2rem" }}
      >
        <label className="py-2" style={{ color: "red" }}>
          IPACO Form 1001
        </label>
      </div>
    </div>
  );
}
