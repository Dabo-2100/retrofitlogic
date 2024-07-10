import React from "react";
import { useState } from "react";
import "./index.scss";
import Logo from "@/assets/New_Logo.png";
import { $Resizer } from "@/store";
import { useRecoilState } from "recoil";
export default function Form_1003_B() {
  const [data] = useState([7, 8, 9, 10, 11, 12]);
  const [, SetResizer] = useRecoilState($Resizer);
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

  const toggleMark = (event) => {
    let el = event.target;
    let parent = el.parentElement;
    let cross = parent.querySelector(".cross");
    let currentStyle = window.getComputedStyle(cross);
    if (currentStyle.display == "block") {
      cross.style.display = "none";
    } else {
      cross.style.display = "block";
    }
  };
  return (
    <div
      id="Form_1003"
      className="animate__animated animate__fadeIn"
      onContextMenu={openResizer}
      onClick={(e) => {
        e.stopPropagation();
        closeResizer();
      }}
    >
      <div className="formHeader col-12">
        <div className="leftSection col-3 d-flex align-content-center">
          <div className="col-12 d-flex">
            {/* <div className="col-3">
                            <label className="col-12 text-center">Control No</label>
                            <div className="col-12">
                                <input className="col-3" maxLength={1} />
                                <input className="col-3" maxLength={1} />
                                <input className="col-3" maxLength={1} />
                                <input className="col-3" maxLength={1} />
                            </div>
                        </div>
                        <div className="col-4 aircraftNo">
                            <label className="col-12 text-center">Aircraft No</label>
                            <div className="col-12 d-flex">
                                <input maxLength={1} />
                                <input maxLength={1} />
                                <input maxLength={1} />
                                <input maxLength={1} />
                                <input maxLength={1} />
                            </div>
                        </div>
                        <div className="col-5 d-flex">
                            <div className="col-4">
                                <label className="col-12 text-center">Day</label>
                                <div className="col-12">
                                    <input className="col-6" maxLength={1} />
                                    <input className="col-6" maxLength={1} />
                                </div>
                            </div>
                            <div className="col-4">
                                <label className="col-12 text-center">Mth</label>
                                <div className="col-12">
                                    <input className="col-6" maxLength={1} />
                                    <input className="col-6" maxLength={1} />
                                </div>
                            </div>
                            <div className="col-4">
                                <label className="col-12 text-center">Yr</label>
                                <div className="col-12">
                                    <input className="col-6" maxLength={1} />
                                    <input className="col-6" maxLength={1} />
                                </div>
                            </div>
                        </div> */}
          </div>
        </div>
        <div className="centerSection col-5 d-flex flex-wrap align-items-center">
          {/* <div className="col-12 d-flex gap-1 align-items-center justify-content-center">
                        <h1>Maintenance Work Order</h1>
                        <span style={{ fontSize: "10px" }}>–Continuation Sheet</span>
                    </div> */}
          <p className="col-12 text-center">Certificate of Work</p>
        </div>
        <div className="rightSection col-2">
          <img src={Logo} />
          <div className="col-12 d-flex justify-content-end">
            {/* <div className="sheetNo col-12">
                            <label className="col-4">Sheet No</label>
                            <input type="text" className="col-2" maxLength="1" />
                            <input type="text" className="col-2" maxLength="1" />
                            <input type="text" className="col-2" maxLength="1" />
                            <input type="text" className="col-2" maxLength="1" />
                        </div> */}
          </div>
        </div>
      </div>
      <div className="formBody col-12 pb-0">
        <table className="table table-bordered col-12 mb-0">
          <thead>
            <tr>
              <th rowSpan={3}>-</th>
              <th rowSpan={3}>Work Required</th>
              <th rowSpan={2} style={{ fontSize: "9px" }}>
                Operator
                <br />
                Code
              </th>
              <th rowSpan={3}>Work Done</th>
              <th colSpan={3}>Operator</th>
              <th colSpan={3}>Inspector</th>
            </tr>
            <tr>
              <th rowSpan={2}>Work Hours</th>
              <th>Time</th>
              <th>Signature</th>
              <th rowSpan={2}>Work Hours</th>
              <th>Time</th>
              <th>Signature</th>
            </tr>
            <tr>
              <th style={{ fontSize: "9px" }}>W/Hrs</th>
              <th>Date</th>
              <th>Printed Name</th>
              <th>Date</th>
              <th>Printed Name</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              return (
                <React.Fragment key={row}>
                  <tr key={row}>
                    <td
                      onContextMenu={toggleMark}
                      rowSpan={2}
                      style={{ width: "3%" }}
                    >
                      {row}
                    </td>
                    <td rowSpan={2} style={{ width: "27%" }}>
                      <textarea
                        className="col-12"
                        style={{ fontSize: "18px" }}
                      ></textarea>
                    </td>
                    <td style={{ width: "5%" }}>
                      <input className="col-12" style={{ fontSize: "18px" }} />
                    </td>
                    <td rowSpan={2} style={{ width: "27%" }}>
                      <textarea
                        className="col-12"
                        style={{ fontSize: "12px" }}
                      ></textarea>
                    </td>
                    <td
                      rowSpan={2}
                      style={{ width: "5%", position: "relative" }}
                    >
                      <span className="cross"></span>
                      <textarea className="col-12"></textarea>
                    </td>
                    <td style={{ width: "5%" }}>
                      <input className="col-12" />
                    </td>
                    <td style={{ width: "9%" }}>
                      <input className="col-12" />
                    </td>
                    <td rowSpan={2} style={{ width: "5%" }}>
                      <textarea className="col-12"></textarea>
                    </td>
                    <td style={{ width: "5%" }}>
                      <input className="col-12" />
                    </td>
                    <td style={{ width: "9%" }}>
                      <input className="col-12" />
                    </td>
                  </tr>
                  <tr key={index + 20}>
                    <td>
                      <input className="col-12" />
                    </td>
                    <td>
                      <input className="col-12" />
                    </td>
                    <td>
                      <input className="col-12" />
                    </td>
                    <td>
                      <input className="col-12" />
                    </td>
                    <td>
                      <input className="col-12" />
                    </td>
                  </tr>
                </React.Fragment>
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
          IPACO Form 1003
        </label>
      </div>
    </div>
  );
}
