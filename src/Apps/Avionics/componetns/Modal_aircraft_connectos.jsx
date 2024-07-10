import { useRecoilState } from "recoil";
import {
  $Server,
  $Token,
  $LoaderIndex,
  $ActiveModal,
  $ModalData,
} from "@/store";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

export default function Modal_aircraft_connectos() {
  const resTable = useRef();
  const [, setLoaderIndex] = useRecoilState($LoaderIndex);
  const [, setActiveModal] = useRecoilState($ActiveModal);
  const [modalData, setModalData] = useRecoilState($ModalData);
  const [Server_Url] = useRecoilState($Server);
  const [token] = useRecoilState($Token);
  const [searchRes, setSearchRes] = useState([]);
  const [viewRows, setViewRows] = useState([]);

  const [s1Close, setS1Close] = useState("not");
  const [s1Open, setS1Open] = useState("not");
  const [s1Removed, setS1Removed] = useState("not");

  const [s2Close, setS2Colse] = useState("not");
  const [s2Open, setS2Open] = useState("not");
  const [s2Removed, setS2Removed] = useState("not");

  const handleCloseModal = () => {
    let data = { ...modalData };
    data.addConnectorsToId = null;
    setModalData(data);
    setActiveModal(0);
  };

  const getAircraftConnectors = () => {
    let id = modalData.addConnectorsToId;
    axios
      .post(
        `${Server_Url}/php/index.php/api/aircrafts/${id}/connectors`,
        {
          is_open: [s1Open, s1Close, s1Removed],
          is_insalled: [s2Open, s2Close, s2Removed],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((Res) => {
        let res = Res.data;
        // console.log(res.msg);
        if (!res.err) {
          setSearchRes(res.data);
          setViewRows(res.data);
        } else {
          setSearchRes([]);
          setViewRows([]);
        }
        setLoaderIndex(0);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeOpenStatus = (log_id, field) => {
    event.preventDefault();
    let newVal = event.target.value;
    Swal.fire({
      icon: "question",
      showDenyButton: true,
      text: "Are you sure you want to change the open status ?",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .post(
            `${Server_Url}/php/index.php/api/update`,
            {
              table_name: "connectors_vs_aircrafts",
              condition: `log_id = ${log_id}`,
              data: {
                [field]: +newVal,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            getAircraftConnectors();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  const handleSearch = () => {
    let searchVal = event.target.value;
    let final = searchRes.filter((el) => {
      return el.connector_name.toLowerCase().includes(searchVal);
    });
    setViewRows(final);
  };

  const handlePrint = () => {
    // console.log(resTable.current.outerHTML);
    // var newWin = window.open('', 'Print-Window');
    var newWin = window.open("");
    newWin.document.open();
    newWin.document.write("<html><head><title>Print Report</title>");
    newWin.document.write(`
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            <style>
            table,tr,td,th{
                text-align : center;
                vertical-align : middle;
            }
            .redStatus {
                padding: 8px !important;
                text-align: center;
                color: #f25570 !important;
                background-color: #fdeaed !important;
                font-weight: 600 !important;
              }
              
              .blueStatus {
                padding: 8px !important;
                text-align: center;
                color: #4567ea !important;
                background-color: #e8ecfc !important;
                font-weight: 600 !important;
              }
              
              .greenStatus {
                padding: 8px !important;
                text-align: center;
                color: #1ac0c0 !important;
                background-color: #e3f7f7 !important;
                font-weight: 600 !important;
              }
              
              .yellowStatus {
                padding: 8px !important;
                text-align: center;
                color: #f98b3c !important;
                background-color: #fef0e6 !important;
                font-weight: 600 !important;
              }
              
              .violetStatus {
                padding: 8px !important;
                text-align: center;
                color: #9061ff !important;
                background-color: #f0eaff !important;
                font-weight: 600 !important;
              }
            </style>
        `);
    newWin.document.write(
      '</head><body class="p-5" onload="window.print();window.close()">'
    );
    newWin.document.write(resTable.current.outerHTML);
    newWin.document.write("</body></html>");
    // newWin.document.close();
  };

  useEffect(() => {
    getAircraftConnectors();
  }, []);

  useEffect(() => {
    getAircraftConnectors();
  }, [s1Open, s1Close, s1Removed, s2Open, s2Close, s2Removed]);

  return (
    <div className="Modal" onClick={handleCloseModal}>
      <div
        className="content animate__animated animate__fadeInDown p-3 d-flex flex-wrap"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="col-12 header">
          View aircraft S/N : {modalData.addConnectorsToSN} Connectors
        </h1>
        <div className="col-12">
          <div className="col-12">
            <input
              onKeyUp={handleSearch}
              className="col-12 form-control"
              type="search"
              placeholder="Search Connectors by S/N"
            />
          </div>
          <div className="col-12 d-flex my-3 align-items-center justify-content-between">
            <p className="m0">Advanced Search</p>
            <div className="d-flex gap-3 align-items-center">
              <button
                className="btn btn-success"
                onClick={getAircraftConnectors}
              >
                Show All
              </button>
              <FontAwesomeIcon
                onClick={handlePrint}
                style={{ fontSize: "1.5rem" }}
                icon={faPrint}
              />
            </div>
          </div>

          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Open Status</th>
                <td>
                  <div className="d-flex align-items-center gap-1 col-12">
                    <input
                      id="s1Open"
                      type="checkbox"
                      onChange={(e) => {
                        e.target.checked ? setS1Open(1) : setS1Open("not");
                      }}
                    />
                    <label htmlFor="s1Open">Open</label>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-1 col-12">
                    <input
                      id="s1Close"
                      type="checkbox"
                      onChange={(e) => {
                        e.target.checked ? setS1Close(0) : setS1Close("not");
                      }}
                    />
                    <label htmlFor="s1Close">Closed</label>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-1 col-12">
                    <input
                      id="s1Removed"
                      type="checkbox"
                      onChange={(e) => {
                        e.target.checked
                          ? setS1Removed(2)
                          : setS1Removed("not");
                      }}
                    />
                    <label htmlFor="s1Removed">Disconnected for access</label>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Installed Status</th>
                <td>
                  <div className="d-flex align-items-center gap-1 col-12">
                    <input
                      id="s2Open"
                      type="checkbox"
                      onChange={(e) => {
                        e.target.checked ? setS2Open(1) : setS2Open("not");
                      }}
                    />
                    <label htmlFor="s2Open">Orignial</label>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-1 col-12">
                    <input
                      id="s2Close"
                      type="checkbox"
                      onChange={(e) => {
                        e.target.checked ? setS2Colse(0) : setS2Colse("not");
                      }}
                    />
                    <label htmlFor="s2Close">Installed</label>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-1 col-12">
                    <input
                      id="s2Removed"
                      type="checkbox"
                      onChange={(e) => {
                        e.target.checked
                          ? setS2Removed("null")
                          : setS2Removed("not");
                      }}
                    />
                    <label htmlFor="s2Removed">N/A</label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {viewRows.length > 0 ? (
          <table className="col-12 table table-bordered" ref={resTable}>
            <thead>
              <tr>
                <th className="col-1">-</th>
                <th className="col-3">Connector Name</th>
                <th className="col-4">Open Status</th>
                <th className="col-4">Installed Status</th>
              </tr>
            </thead>
            <tbody>
              {viewRows.map((connector, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{connector.connector_name}</td>
                    <td>
                      <select
                        value={connector.is_open}
                        onChange={() =>
                          changeOpenStatus(connector.log_id, "is_open")
                        }
                        className={`form-select ${
                          connector.is_open == 0
                            ? "redStatus"
                            : connector.is_open == 1
                            ? "greenStatus"
                            : connector.is_open == 2
                            ? "yellowStatus"
                            : "bg-info"
                        }`}
                      >
                        <option value="0">Closed</option>
                        <option value="1">Open</option>
                        <option value="2">Disconnected For Access</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={connector.is_orignal}
                        onChange={() =>
                          changeOpenStatus(connector.log_id, "is_orignal")
                        }
                        className={`form-select ${
                          connector.is_orignal == 0
                            ? "greenStatus"
                            : connector.is_orignal == 1
                            ? "blueStatus"
                            : "yellowStatus"
                        }`}
                      >
                        <option value={"null"}>N/A</option>
                        <option value="0">Installed</option>
                        <option value="1">Orignal</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="col-12 d-flex flex-wrap">
            <p className="alert alert-danger col-12">
              There is no connectors with that S/N Added to Aircraft{" "}
            </p>
            <button
              onClick={() => setActiveModal(7)}
              className="btn btn-success"
            >
              Add it
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
