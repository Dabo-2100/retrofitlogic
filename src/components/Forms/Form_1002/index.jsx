import { useContext, useState } from "react";
import "./index.scss";
import Logo from "@/assets/New_Logo.png";
import { useRecoilState } from "recoil";
import { $Resizer } from "@/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { $FormData } from "@/store";
import { FormContext } from "@/Apps/Aircraft_Forms/FormContext";
export default function Form_1002() {
  const arrOf = (no) => {
    let x = [];
    for (let index = 1; index <= no; index++) {
      x.push(index);
    }
    return x;
  };
  //   const [formData] = useRecoilState($FormData);
  const { formData } = useContext(FormContext);

  const [cSheet] = useState(arrOf(60));
  const [aSheet] = useState(arrOf(15));
  const [, SetResizer] = useRecoilState($Resizer);

  const makeSheetNo = (no) => {
    let L = String(no).length;
    let final = "";
    for (let index = 0; index < 4 - L; index++) {
      final += "0";
    }
    final += String(no);
    return final;
  };

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

  const toggleIcon = (event) => {
    let el = event.target;
    let tag = el.tagName.toLowerCase();
    let parent = null;
    if (tag == "p") {
      parent = el.parentElement;
    } else {
      if (el.tagName.toLowerCase() == "path") {
        parent = el.parentElement.parentElement;
      } else {
        parent = el.parentElement;
      }
    }
    let icon = parent.querySelector(".icon");
    let styles = window.getComputedStyle(icon);
    if (styles.display == "block") {
      icon.style.display = "none";
    } else {
      icon.style.display = "block";
    }
  };

  return (
    <div
      id="Form_1002"
      className="animate__animated animate__fadeIn"
      onContextMenu={openResizer}
      onClick={(e) => {
        e.stopPropagation();
        closeResizer();
      }}
    >
      <div className="formHeader col-12">
        <div className="leftSection col-3 d-flex align-content-center"></div>
        <div className="centerSection col-5 d-flex flex-wrap align-items-center">
          <div className="col-12 d-flex gap-1 align-items-center justify-content-center">
            <h1 className="col-12">Maintenance Work Order</h1>
            {/* <span style={{ fontSize: "10px" }}>–Continuation Sheet</span> */}
          </div>
          {/* <p className="col-12 text-center">Certificate of Work</p> */}
        </div>
        <div className="rightSection col-2">
          <img src={Logo} />
          {/* <div className="col-12 d-flex justify-content-end ">
                        <div className="sheetNo col-12 d-flex ">
                            <label className="col-4 border border-dark border-2 pt-1">Sheet No</label>
                            <input type="text" className="col-2" maxLength="1" />
                            <input type="text" className="col-2" maxLength="1" />
                            <input type="text" className="col-2" maxLength="1" />
                            <input type="text" className="col-2" maxLength="1" />
                        </div>
                    </div> */}
        </div>
      </div>

      <div className="formBody col-12 pb-0 d-flex flex-wrap gap-3">
        <div
          className="col-12 d-flex flex-wrap gap-3 px-3 border border-dark border-2 s1"
          style={{ fontSize: "12px" }}
        >
          <div className="col-12 d-flex justify-content-between align-items-start">
            <div className="col-3 d-flex">
              <div className="col-3 d-flex flex-wrap">
                <label
                  className="col-12 text-center"
                  style={{ border: "2px solid black", borderTopWidth: 0 }}
                >
                  Control No
                </label>
                <div className="col-12">
                  {formData.sheet_no ? (
                    <>
                      <input
                        className="col-3"
                        maxLength={1}
                        readOnly
                        value={formData.sheet_no}
                        disabled={true}
                        style={{ borderLeftWidth: "2px" }}
                      />
                      <input
                        className="col-3"
                        maxLength={1}
                        readOnly
                        value={makeSheetNo(formData.control_no).split("")[1]}
                        disabled={true}
                      />
                      <input
                        className="col-3"
                        maxLength={1}
                        readOnly
                        value={
                          makeSheetNo(formData.control_no).split(
                            ""
                          )[2]
                        }
                        disabled={true}
                      />
                      <input
                        className="col-3"
                        maxLength={1}
                        readOnly
                        value={
                          makeSheetNo(formData.control_no).split(
                            ""
                          )[3]
                        }
                        disabled={true}
                      />
                    </>
                  ) : (
                    <>
                      <input
                        className="col-3"
                        maxLength={1}
                        style={{ borderLeftWidth: "2px" }}
                      />
                      <input className="col-3" maxLength={1} />
                      <input className="col-3" maxLength={1} />
                      <input className="col-3" maxLength={1} />
                    </>
                  )}
                </div>
              </div>
              {/* <div className="col-4 d-flex flex-wrap">
                <label
                  className="col-12 text-center "
                  style={{
                    border: "2px solid black",
                    borderTopWidth: 0,
                    borderLeftWidth: 0,
                  }}
                >
                  Aircraft No
                </label>
                <div className="col-12">
                  {formData.formInfo.aircraft_sn ? (
                    <>
                      <input
                        maxLength={1}
                        readOnly
                        value={formData.formInfo.aircraft_sn.split("")[0]}
                        disabled={true}
                        style={{ width: "calc(100% /5)" }}
                      />
                      <input
                        maxLength={1}
                        readOnly
                        value={formData.formInfo.aircraft_sn.split("")[1]}
                        disabled={true}
                        style={{ width: "calc(100% /5)" }}
                      />
                      <input
                        maxLength={1}
                        readOnly
                        value={formData.formInfo.aircraft_sn.split("")[2]}
                        disabled={true}
                        style={{ width: "calc(100% /5)" }}
                      />
                      <input
                        maxLength={1}
                        readOnly
                        value={formData.formInfo.aircraft_sn.split("")[3]}
                        disabled={true}
                        style={{ width: "calc(100% /5)" }}
                      />
                      <input
                        maxLength={1}
                        readOnly
                        value={formData.formInfo.aircraft_sn.split("")[4]}
                        disabled={true}
                        style={{ width: "calc(100% /5)" }}
                      />
                    </>
                  ) : (
                    <>
                      <input maxLength={1} style={{ width: "calc(100% /5)" }} />
                      <input maxLength={1} style={{ width: "calc(100% /5)" }} />
                      <input maxLength={1} style={{ width: "calc(100% /5)" }} />
                      <input maxLength={1} style={{ width: "calc(100% /5)" }} />
                      <input maxLength={1} style={{ width: "calc(100% /5)" }} />
                    </>
                  )}
                </div>
              </div>
              <div className="col-5 d-flex flex-wrap">
                <div className="col-4">
                  <label
                    className="col-12 text-center "
                    style={{
                      border: "2px solid black",
                      borderTopWidth: 0,
                      borderLeftWidth: 0,
                    }}
                  >
                    Day
                  </label>
                  <div className="col-12">
                    {formData.formRows[0] ? (
                      <>
                        <input
                          className="col-6"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].date_1001
                              .split("-")[2]
                              .split("")[0]
                          }
                          disabled={true}
                        />
                        <input
                          className="col-6"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].date_1001
                              .split("-")[2]
                              .split("")[1]
                          }
                          disabled={true}
                        />
                      </>
                    ) : (
                      <>
                        <input className="col-6" maxLength={1} />
                        <input className="col-6" maxLength={1} />
                      </>
                    )}
                  </div>
                </div>
                <div className="col-4">
                  <label
                    className="col-12 text-center "
                    style={{
                      border: "2px solid black",
                      borderTopWidth: 0,
                      borderLeftWidth: 0,
                    }}
                  >
                    Mth
                  </label>
                  <div className="col-12">
                    {formData.formRows[0] ? (
                      <>
                        <input
                          className="col-6"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].date_1001
                              .split("-")[1]
                              .split("")[0]
                          }
                          disabled={true}
                        />
                        <input
                          className="col-6"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].date_1001
                              .split("-")[1]
                              .split("")[1]
                          }
                          disabled={true}
                        />
                      </>
                    ) : (
                      <>
                        <input className="col-6" maxLength={1} />
                        <input className="col-6" maxLength={1} />
                      </>
                    )}
                  </div>
                </div>
                <div className="col-4">
                  <label
                    className="col-12 text-center "
                    style={{
                      border: "2px solid black",
                      borderTopWidth: 0,
                      borderLeftWidth: 0,
                    }}
                  >
                    Yr
                  </label>
                  <div className="col-12">
                    {formData.formRows[0] ? (
                      <>
                        <input
                          className="col-6"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].date_1001
                              .split("-")[0]
                              .split("")[2]
                          }
                          disabled={true}
                        />
                        <input
                          className="col-6"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].date_1001
                              .split("-")[0]
                              .split("")[3]
                          }
                          disabled={true}
                        />
                      </>
                    ) : (
                      <>
                        <input className="col-6" maxLength={1} />
                        <input className="col-6" maxLength={1} />
                      </>
                    )}
                  </div>
                </div>
              </div> */}
            </div>
            {/* <div className="col-3 d-flex">
              <div className="col-12 d-flex">
                <label
                  className="col-5 text-center pt-1"
                  style={{ border: "2px solid black", borderTopWidth: 0 }}
                >
                  Airframe Hours
                </label>
                <div className="col-7 d-flex">
                  <input maxLength={1} style={{ width: "calc(100% /7)" }} />
                  <input maxLength={1} style={{ width: "calc(100% /7)" }} />
                  <input maxLength={1} style={{ width: "calc(100% /7)" }} />
                  <input maxLength={1} style={{ width: "calc(100% /7)" }} />
                  <input maxLength={1} style={{ width: "calc(100% /7)" }} />
                  <input maxLength={1} style={{ width: "calc(100% /7)" }} />
                  <input maxLength={1} style={{ width: "calc(100% /7)" }} />
                </div>
              </div>
            </div> */}
          </div>
          {/* <div className="col-12 d-flex">
            <div className="col-4 d-flex flex-wrap">
              <div
                className="col-3 d-flex flex-wrap"
                style={{ border: "2px solid black", borderBottomWidth: 0 }}
              >
                <p
                  className="col-12 text-center p-1"
                  style={{
                    border: "0px solid black",
                    borderBottomWidth: "2px",
                  }}
                >
                  Start
                </p>
                <p className="col-12 text-center p-1">Time / Date</p>
              </div>
              <div className="col-9 d-flex flex-wrap s2">
                <div
                  className="col-3 d-flex flex-wrap "
                  style={{ borderLeft: "0" }}
                >
                  <label
                    className="col-12 text-center  p-1"
                    style={{ border: "2px solid black", borderLeftWidth: 0 }}
                  >
                    Time
                  </label>
                  <div className="col-12 d-flex">
                    {formData.formRows[0] ? (
                      <>
                        <input
                          className="col-3"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].log_start_time.split("")[0]
                          }
                          disabled={true}
                        />
                        <input
                          className="col-3"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].log_start_time.split("")[1]
                          }
                          disabled={true}
                        />
                        <input
                          className="col-3"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].log_start_time.split("")[3]
                          }
                          disabled={true}
                        />
                        <input
                          className="col-3"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].log_start_time.split("")[4]
                          }
                          disabled={true}
                        />
                      </>
                    ) : (
                      <>
                        <input className="col-3" maxLength={1} />
                        <input className="col-3" maxLength={1} />
                        <input className="col-3" maxLength={1} />
                        <input className="col-3" maxLength={1} />
                      </>
                    )}
                  </div>
                </div>
                <div
                  className="col-3 d-flex flex-wrap "
                  style={{ borderLeft: "0" }}
                >
                  <label
                    className="col-12 text-center p-1"
                    style={{ border: "2px solid black", borderLeftWidth: 0 }}
                  >
                    Day
                  </label>
                  <div className="col-12 d-flex">
                    {formData.formRows[0] ? (
                      <>
                        <input
                          className="col-6"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].log_start_Date
                              .split("-")[2]
                              .split("")[0]
                          }
                          disabled={true}
                        />
                        <input
                          className="col-6"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].log_start_Date
                              .split("-")[2]
                              .split("")[1]
                          }
                          disabled={true}
                        />
                      </>
                    ) : (
                      <>
                        <input className="col-6" maxLength={1} />
                        <input className="col-6" maxLength={1} />
                      </>
                    )}
                  </div>
                </div>
                <div
                  className="col-3 d-flex flex-wrap "
                  style={{ borderLeft: "0" }}
                >
                  <label
                    className="col-12 text-center p-1"
                    style={{ border: "2px solid black", borderLeftWidth: 0 }}
                  >
                    Mth
                  </label>
                  <div className="col-12 d-flex">
                    {formData.formRows[0] ? (
                      <>
                        <input
                          className="col-6"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].log_start_Date
                              .split("-")[1]
                              .split("")[0]
                          }
                          disabled={true}
                        />
                        <input
                          className="col-6"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].log_start_Date
                              .split("-")[1]
                              .split("")[1]
                          }
                          disabled={true}
                        />
                      </>
                    ) : (
                      <>
                        <input className="col-6" maxLength={1} />
                        <input className="col-6" maxLength={1} />
                      </>
                    )}
                  </div>
                </div>
                <div
                  className="col-3 d-flex flex-wrap "
                  style={{ borderLeft: "0" }}
                >
                  <label
                    className="col-12 text-center p-1"
                    style={{ border: "2px solid black", borderLeftWidth: 0 }}
                  >
                    Yr
                  </label>
                  <div className="col-12 d-flex">
                    {formData.formRows[0] ? (
                      <>
                        <input
                          className="col-6"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].log_start_Date
                              .split("-")[0]
                              .split("")[2]
                          }
                          disabled={true}
                        />
                        <input
                          className="col-6"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].log_start_Date
                              .split("-")[0]
                              .split("")[3]
                          }
                          disabled={true}
                        />
                      </>
                    ) : (
                      <>
                        <input className="col-6" maxLength={1} />
                        <input className="col-6" maxLength={1} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        {/* <div className="col-12 d-flex s3">
          <div className="col-5" style={{ fontSize: "12px" }}>
            <h1
              className="col-12  text-center py-1"
              style={{ fontSize: "14px" }}
            >
              SYMPTOM / WORK REQUIRED
            </h1>
            {formData.formRows[0] ? (
              <>
                <textarea
                  className="col-12"
                  readOnly
                  value={formData.formRows[0].work_required}
                  disabled={true}
                  style={{ resize: "none" }}
                ></textarea>
              </>
            ) : (
              <>
                <textarea
                  className="col-12"
                  style={{ resize: "none" }}
                ></textarea>
              </>
            )}
          </div>
          <div className="col-2" style={{ fontSize: "12px" }}>
            <h1
              className="col-12  text-center py-1"
              style={{ fontSize: "14px", borderLeftWidth: 0 }}
            >
              Reason
            </h1>
            {formData.formRows[0] ? (
              <>
                <textarea
                  className="col-12"
                  readOnly
                  value={formData.formRows[0].log_reason}
                  disabled={true}
                  style={{ resize: "none", borderLeftWidth: 0 }}
                ></textarea>
              </>
            ) : (
              <>
                <textarea
                  className="col-12"
                  style={{ resize: "none", borderLeftWidth: 0 }}
                ></textarea>
              </>
            )}
          </div>
          <div className="col-5" style={{ fontSize: "12px" }}>
            <h1
              className="col-12  text-center py-1"
              style={{ fontSize: "14px", borderLeftWidth: 0 }}
            >
              ACTION / WORK DONE
            </h1>
            {formData.formRows[0] ? (
              <>
                <textarea
                  className="col-12"
                  readOnly
                  value={formData.formRows[0].action_taken}
                  disabled={true}
                  style={{ resize: "none", borderLeftWidth: 0 }}
                ></textarea>
              </>
            ) : (
              <>
                <textarea
                  className="col-12"
                  style={{ resize: "none", borderLeftWidth: 0 }}
                ></textarea>
              </>
            )}
          </div>
        </div>

        <div className="col-12 d-flex s4 gap-0 border-0">
          <div className="col-6 d-flex flex-wrap">
            <div className="col-12" style={{ fontSize: "12px" }}>
              <h1
                className="col-12  text-start p-2"
                style={{ fontSize: "12px" }}
              >
                Item Description
              </h1>
              {formData.formRows[0] ? (
                <>
                  <textarea
                    className="col-12"
                    readOnly
                    value={formData.formRows[0].item_desc}
                    disabled={true}
                    style={{ resize: "none" }}
                  ></textarea>
                </>
              ) : (
                <>
                  <textarea
                    className="col-12"
                    style={{ resize: "none" }}
                  ></textarea>
                </>
              )}
            </div>
            <div className="col-12 d-flex flex-wrap">
              <div className="col-12 d-flex">
                <h1
                  className="col-4 text-center pt-2"
                  style={{ fontSize: "12px" }}
                >
                  Serial No
                </h1>
                {formData.formRows[0] ? (
                  <>
                    <input
                      className="col-8"
                      readOnly
                      value={formData.formRows[0].item_sn}
                      disabled={true}
                      style={{
                        border: "2px solid black",
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                      }}
                    />
                  </>
                ) : (
                  <>
                    <input
                      className="col-8"
                      style={{
                        border: "2px solid black",
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                      }}
                    />
                  </>
                )}
                <input
                  className="col-8"
                  style={{
                    border: "2px solid black",
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                  }}
                />
              </div>
              <div className="col-12 d-flex">
                <h1
                  className="col-4 text-center pt-2"
                  style={{ fontSize: "12px", borderBottomWidth: "2px" }}
                >
                  Part No
                </h1>
                {formData.formRows[0] ? (
                  <>
                    <input
                      className="col-8"
                      readOnly
                      value={formData.formRows[0].item_pn}
                      disabled={true}
                      style={{
                        border: "0px solid black",
                        borderBottomWidth: "2px",
                      }}
                    />
                  </>
                ) : (
                  <>
                    <input
                      className="col-8"
                      style={{
                        border: "0px solid black",
                        borderBottomWidth: "2px",
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="col-6 d-flex flex-wrap">
            <div className="col-12" style={{ fontSize: "12px" }}>
              <h1
                className="col-12  text-start p-2"
                style={{ fontSize: "12px", borderLeftWidth: 0 }}
              >
                Replacement Item Description
              </h1>
              {formData.formRows[0] ? (
                <>
                  <textarea
                    className="col-12"
                    readOnly
                    value={formData.formRows[0].replace_item_desc}
                    disabled={true}
                    style={{ resize: "none", borderLeftWidth: 0 }}
                  ></textarea>
                </>
              ) : (
                <>
                  <textarea
                    className="col-12"
                    style={{ resize: "none", borderLeftWidth: 0 }}
                  ></textarea>
                </>
              )}
            </div>
            <div className="col-12 d-flex flex-wrap ">
              <div className="col-12 d-flex">
                <h1
                  className="col-4 text-center pt-1"
                  style={{ fontSize: "12px" }}
                >
                  Serial No
                </h1>
                {formData.formRows[0] ? (
                  <>
                    <input
                      className="col-8"
                      readOnly
                      value={formData.formRows[0].replace_item_sn}
                      disabled={true}
                      style={{
                        border: "0px solid black",
                        borderTopWidth: "2px",
                        borderRightWidth: "2px",
                      }}
                    />
                  </>
                ) : (
                  <>
                    <input
                      className="col-8"
                      style={{
                        border: "0px solid black",
                        borderTopWidth: "2px",
                        borderRightWidth: "2px",
                      }}
                    />
                  </>
                )}
              </div>
              <div className="col-12 d-flex">
                <h1
                  className="col-4 text-center pt-1"
                  style={{ fontSize: "12px", borderBottomWidth: "2px" }}
                >
                  Part No
                </h1>
                {formData.formRows[0] ? (
                  <>
                    <input
                      className="col-8"
                      readOnly
                      value={formData.formRows[0].replace_item_pn}
                      disabled={true}
                      style={{
                        border: "0px solid black",
                        borderTopWidth: "2px",
                        borderBottomWidth: "2px",
                        borderRightWidth: "2px",
                      }}
                    />
                  </>
                ) : (
                  <>
                    <input
                      className="col-8"
                      style={{
                        border: "0px solid black",
                        borderTopWidth: "2px",
                        borderBottomWidth: "2px",
                        borderRightWidth: "2px",
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 d-flex" style={{ fontSize: "12px" }}>
          <div style={{ width: "35%" }} className="d-flex flex-wrap">
            <p
              className="col-12 text-center p-1"
              style={{ border: "2px solid black", borderBottomWidth: 0 }}
            >
              CONTINUATION SHEETS (X)
            </p>
            <div
              className="col-12  d-flex flex-wrap"
              style={{
                border: "2px solid black",
                borderRightWidth: 0,
                borderTopWidth: 0,
              }}
            >
              {cSheet.map((el, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      width: "calc(100% / 15)",
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onClick={toggleIcon}
                  >
                    <p
                      className=" text-center"
                      style={{
                        border: "2px solid black",
                        borderBottomWidth: 0,
                        borderLeftWidth: 0,
                      }}
                    >
                      {el}
                    </p>
                    <FontAwesomeIcon
                      className="icon"
                      icon={faX}
                      style={{
                        width: "calc(100%)",
                        display: `${
                          formData.formRows[0]
                            ? index + 1 <= formData.formRows[0].cSheets_no
                              ? "block"
                              : "none"
                            : "none"
                        }`,
                        position: "absolute",
                        top: "2px",
                        zIndex: 2,
                        color: "#212529c7",
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <p
              className="col-12 text-center p-1"
              style={{
                border: "2px solid black",
                borderTopWidth: 0,
                borderBottomWidth: 0,
              }}
            >
              Additional item Idents (X)
            </p>
            <div
              className="col-12  d-flex flex-wrap"
              style={{
                border: "2px solid black",
                borderTopWidth: 0,
                borderRightWidth: 0,
              }}
            >
              {aSheet.map((el, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      width: "calc(100% / 15)",
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onClick={toggleIcon}
                  >
                    <p
                      className=" text-center"
                      style={{
                        border: "2px solid black",
                        borderBottomWidth: 0,
                        borderLeftWidth: 0,
                      }}
                    >
                      {el}
                    </p>
                    <FontAwesomeIcon
                      className="icon"
                      icon={faX}
                      style={{
                        width: "calc(100% )",
                        display: "none",
                        position: "absolute",
                        top: "2px",
                        zIndex: 2,
                        color: "#212529c7",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div
            style={{ width: "30%" }}
            className="d-flex flex-wrap justify-items-start align-items-start"
          >
            <p
              className="col-12 p-1"
              style={{ border: "2px solid black", borderLeftWidth: 0 }}
            >
              Comments
            </p>
            {formData.formRows[0] ? (
              <>
                <textarea
                  className="col-12"
                  readOnly
                  value={formData.formRows[0].log_comments}
                  disabled={true}
                  style={{
                    resize: "none",
                    height: "104px",
                    border: "2px solid black",
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                  }}
                ></textarea>
              </>
            ) : (
              <>
                <textarea
                  className="col-12"
                  style={{
                    resize: "none",
                    height: "104px",
                    border: "2px solid black",
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                  }}
                ></textarea>
              </>
            )}
          </div>
          <div
            style={{
              width: "35%",
              border: "0px solid black",
              borderBottomWidth: "2px",
            }}
            className="d-flex flex-wrap "
          >
            <div
              className="col-12 d-flex"
              style={{ border: "2px solid black", borderLeftWidth: 0 }}
            >
              <p className="col-5 text-center p-2">
                MWO <br /> Inspector
              </p>
              <div className="col-7 d-flex s5">
                <div className="col-3">
                  <label
                    className="col-12 text-center"
                    style={{
                      border: "2px solid black",
                      borderTopWidth: 0,
                      borderBottomWidth: 0,
                    }}
                  >
                    Time
                  </label>
                  <div className="col-12 d-flex">
                    <input
                      maxLength={1}
                      className="col-3"
                      style={{ borderLeftWidth: "2px" }}
                    />
                    <input maxLength={1} className="col-3" />
                    <input maxLength={1} className="col-3" />
                    <input maxLength={1} className="col-3" />
                  </div>
                </div>
                <div className="col-3 ">
                  <label className="col-12 text-center">Day</label>
                  <div className="col-12 d-flex">
                    {formData.formRows[0] ? (
                      <>
                        <input
                          className="col-6 text-center"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].insection_date
                              .split("-")[2]
                              .split("")[0]
                          }
                          disabled={true}
                        />
                        <input
                          className="col-6 text-center"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].insection_date
                              .split("-")[2]
                              .split("")[1]
                          }
                          disabled={true}
                        />
                      </>
                    ) : (
                      <>
                        <input className="col-6 text-center" maxLength={1} />
                        <input className="col-6 text-center" maxLength={1} />
                      </>
                    )}
                  </div>
                </div>
                <div className="col-3 ">
                  <label
                    className="col-12 text-center"
                    style={{
                      border: "2px solid black",
                      borderTopWidth: 0,
                      borderBottomWidth: 0,
                    }}
                  >
                    Mth
                  </label>
                  <div className="col-12 d-flex">
                    {formData.formRows[0] ? (
                      <>
                        <input
                          className="col-6 text-center"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].insection_date
                              .split("-")[1]
                              .split("")[0]
                          }
                          disabled={true}
                        />
                        <input
                          className="col-6 text-center"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].insection_date
                              .split("-")[1]
                              .split("")[1]
                          }
                          disabled={true}
                        />
                      </>
                    ) : (
                      <>
                        <input className="col-6 text-center" maxLength={1} />
                        <input className="col-6 text-center" maxLength={1} />
                      </>
                    )}
                  </div>
                </div>
                <div className="col-3 ">
                  <label className="col-12 text-center">Yr</label>
                  <div className="col-12 d-flex">
                    {formData.formRows[0] ? (
                      <>
                        <input
                          className="col-6 text-center"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].insection_date
                              .split("-")[0]
                              .split("")[2]
                          }
                          disabled={true}
                        />
                        <input
                          className="col-6 text-center"
                          maxLength={1}
                          readOnly
                          value={
                            formData.formRows[0].insection_date
                              .split("-")[0]
                              .split("")[3]
                          }
                          disabled={true}
                          style={{ borderRightWidth: 0 }}
                        />
                      </>
                    ) : (
                      <>
                        <input className="col-6 text-center" maxLength={1} />
                        <input
                          className="col-6 text-center"
                          maxLength={1}
                          style={{ borderRightWidth: 0 }}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 d-flex">
              <label className="col-4 pt-2 text-center">Name (Print)</label>

              {formData.formRows[0] ? (
                <>
                  <input
                    className="col-8"
                    readOnly
                    value={formData.formRows[0].inspector_name}
                    disabled={true}
                    style={{ border: "2px solid black", borderTopWidth: 0 }}
                  />
                </>
              ) : (
                <>
                  <input
                    className="col-8"
                    style={{ border: "2px solid black", borderTopWidth: 0 }}
                  />
                </>
              )}
            </div>
            <div className="col-12 d-flex">
              <label className="col-4 pt-2 text-center">Signature</label>
              <input
                className="col-8"
                style={{
                  border: "2px solid black",
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                }}
              />
            </div>
          </div>
        </div> */}
      </div>

      <div
        className="formFooter col-12 d-flex justify-content-end"
        style={{ paddingRight: "2rem" }}
      >
        <label className="py-2" style={{ color: "red" }}>
          IPACO Form 1002
        </label>
      </div>
    </div>
  );
}
