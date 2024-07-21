import React, { useContext, useEffect, useState } from "react";
import "./index.scss";
import axios from "axios";
import { useRecoilState } from "recoil";
import { $Server } from "@/store";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { Chart as ChartJS2, ArcElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import ProgressBar from "@/Apps/Projects/components/ProgressBar";
import { ReportContext } from "./ReportContext";
import PartDetails from "./Modals/PartDetails";

export default function ReportsPage() {
  const { detailsModal, setDetailsModal } = useContext(ReportContext);
  const setRandomColor = () => {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  };

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  ChartJS2.register(ArcElement, Tooltip, Legend);

  const [chart2, setChart2] = useState({
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "SB % : ",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(200, 200, 200, 0.1)", // Grid line color
        },
        ticks: {
          color: "white", // X-axis label color
        },
        font: {
          size: "14px",
        },
      },
      y: {
        grid: {
          color: "rgba(200, 200, 200, 0.1)", // Grid line color
          backgroundColor: "red", // Grid background color
        },
        ticks: {
          color: "white", // Y-axis label color
        },
        font: {
          size: "14px",
        },
      },
    },
  };

  const [Server_Url] = useRecoilState($Server);
  const params = useParams();
  const [reportData, setReportData] = useState([]);
  const [modalIndex, setModalIndex] = useState();

  const [chart1_data, setChart1_data] = useState({
    labels: ["jan", "feb"],
    datasets: [{ label: "Dataset 1", data: [200, 300, 400, 1000] }],
  });

  const [finalPercentage, setFinalPercentage] = useState();

  const groupBySbNo = (data) => {
    return data.reduce((acc, curr) => {
      (acc[curr.sb_no] = acc[curr.sb_no] || []).push(curr);
      return acc;
    }, {});
  };

  const getReportData = async () => {
    await axios
      .get(
        `${Server_Url}/php/index.php/api/reports/${params.reportNo}/${params.projectID}`
      )
      .then((res) => {
        // console.log(res.data);
        let da = res.data.data;
        let final = groupBySbNo(da);
        let finalArr = [];
        for (const key in final) {
          let sb_total_duration = 0;
          let sb_a_duration = 0;
          let sb_s_duration = 0;
          let sb_done_s_duration = 0;
          let sb_done_a_duration = 0;
          final[key].forEach((element) => {
            sb_total_duration += element.total_duration;
            sb_s_duration += element.structure_duration;
            sb_a_duration += element.avionics_duration;

            sb_done_s_duration += element.done_duration_s;
            sb_done_a_duration += element.done_duration_a;
          });

          let done_percentage =
            ((sb_done_s_duration + sb_done_a_duration) / sb_total_duration) *
            100;

          let obj = {
            sb_name: key,
            total_duration: sb_total_duration.toFixed(2),
            structure_duration: sb_s_duration.toFixed(2),
            avionics_duration: sb_a_duration.toFixed(2),
            sb_done_percentage: done_percentage.toFixed(2),

            s_done_duration: sb_done_s_duration.toFixed(2),
            a_done_duration: sb_done_a_duration.toFixed(2),

            row_data: final[key],
          };
          finalArr.push(obj);
        }

        finalArr.sort((a, b) => {
          const sbNameA = a.sb_name.toUpperCase();
          const sbNameB = b.sb_name.toUpperCase();

          if (sbNameA < sbNameB) {
            return -1;
          }
          if (sbNameA > sbNameB) {
            return 1;
          }

          return 0;
        });
        let finalLabels = [];
        let totalDuration = 0;

        finalArr.forEach((el) => {
          totalDuration += +el.total_duration;
          finalLabels.push(el.sb_name);
        });
        let finalData = [];
        let totalPercent = 0;
        finalArr.forEach((el) => {
          let x = isNaN(+el.sb_done_percentage / 100)
            ? 0
            : +el.sb_done_percentage / 100;
          let y = +el.total_duration;
          totalPercent += (x * y) / +totalDuration;
          finalData.push(el.sb_done_percentage);
        });
        let f = (totalPercent * 100).toFixed(2);
        setFinalPercentage(f);
        let obj = {
          labels: finalLabels,
          datasets: [
            { label: "SB.No", data: finalData, backgroundColor: "#7824F6" },
          ],
        };
        setChart1_data(obj);
        // console.log(finalArr);
        setReportData(finalArr);
        console.log(finalArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (modalIndex !== undefined) {
      let parts = reportData[modalIndex]["row_data"];
      let obj = {
        labels: parts.map((item) => item.sb_part_name),
        datasets: [
          {
            label: "SB %  ",
            data: parts.map((item) => {
              return (
                (+item.total_duration /
                  +reportData[modalIndex]["total_duration"]) *
                100
              ).toFixed(2);
            }),
            backgroundColor: parts.map(() => {
              return setRandomColor();
            }),
            borderColor: [],
            borderWidth: 1,
          },
        ],
      };
      setChart2(obj);
    }
  }, [modalIndex]);

  useEffect(() => {
    getReportData();
  }, []);
  return (
    <div
      className="col-12 d-flex justify-content-center align-items-start py-3 py-md-5"
      id="Report"
    >
      <div className="reportPage container text-white col-12 d-flex flex-column align-items-start">
        {modalIndex !== undefined ? (
          <div
            className="col-12 Modal d-flex px-5 px-md-0 align-items-start pt-3"
            onClick={() => setModalIndex(undefined)}
          >
            <div
              className="col-12 col-md-8 bg-white rounded text-dark p-3 d-flex flex-wrap"
              onClick={(event) => event.stopPropagation()}
            >
              <h5 className="col-12 text-start mb-0 bg-dark text-white p-2">
                SB No : {reportData[modalIndex]["sb_name"]}
              </h5>
              <div className="col-12 d-flex" style={{ overflowX: "auto" }}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th className="col-4 bg-secondary text-white">
                        Service Bulliten Name
                      </th>
                      <td className="col-8" colSpan={2}>
                        {reportData[modalIndex]["row_data"][0]["sb_desc"]}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-secondary text-white">
                        IPACO Estimated Duration
                      </th>
                      <td colSpan={2}>
                        {reportData[modalIndex]["total_duration"]} Hrs
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-secondary text-white">
                        Leonardo Issued Duration
                      </th>
                      <td colSpan={2}>
                        {
                          reportData[modalIndex]["row_data"][0][
                            "issued_duration"
                          ]
                        }{" "}
                        Hrs
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-secondary text-white">
                        Actual Work Duration
                      </th>
                      <td colSpan={2}>
                        {reportData[modalIndex]["total_duration"]} Hrs
                      </td>
                    </tr>

                    <tr>
                      <th className="bg-secondary text-white">SB Progress %</th>
                      <td colSpan={2}>
                        {/* <ProgressBar canEdit={false} progress={reportData[modalIndex]["sb_done_percentage"]}/> */}
                        <b>{reportData[modalIndex]["sb_done_percentage"]} %</b>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="col-4 bg-dark text-white py-2">
                        Part Name
                      </th>
                      <th className="col-4 bg-dark text-white py-2">
                        Structure
                      </th>
                      <th className="col-4 bg-dark text-white py-2">
                        Avionics
                      </th>
                    </tr>
                    {reportData[modalIndex]["row_data"].map((part, index) => {
                      return (
                        <React.Fragment key={index}>
                          <tr>
                            <td rowSpan={2} className="bg-secondary text-white">
                              {part.sb_part_name}
                              <br />
                              {part.total_duration.toFixed(2)} Hrs
                            </td>
                            <td className="bg-secondary text-white">
                              {part.structure_duration.toFixed(2) == 0 ? (
                                "-"
                              ) : (
                                <p>
                                  {part.structure_duration.toFixed(2)} Hrs
                                  <sup
                                    style={{ color: "#585858b3" }}
                                    className="ps-1"
                                  >
                                    {(
                                      (part.structure_duration /
                                        part.total_duration) *
                                      100
                                    ).toFixed(2)}
                                    %
                                  </sup>
                                </p>
                              )}
                            </td>
                            <td className="bg-secondary text-white">
                              {part.avionics_duration.toFixed(2) == 0 ? (
                                "-"
                              ) : (
                                <p>
                                  {part.avionics_duration.toFixed(2)} Hrs
                                  <sup
                                    style={{ color: "#585858b3" }}
                                    className="ps-1"
                                  >
                                    {(
                                      (part.avionics_duration /
                                        part.total_duration) *
                                      100
                                    ).toFixed(2)}
                                    %
                                  </sup>
                                </p>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th className="text-success">
                              {isNaN(
                                (
                                  (+part.done_duration_s /
                                    +part.structure_duration) *
                                  100
                                ).toFixed(2)
                              ) ? (
                                "-"
                              ) : (
                                <p>
                                  {(
                                    (+part.done_duration_s /
                                      +part.structure_duration) *
                                    100
                                  ).toFixed(2) + " %"}

                                  {part.done_duration_s != 0 ? (
                                    <span
                                      style={{
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                        marginLeft: "10px",
                                        fontSize: "12px",
                                        color: "blue",
                                      }}
                                      onClick={() => {
                                        setDetailsModal({
                                          index: true,
                                          part_id: part.recorded_s_id,
                                        });
                                      }}
                                    >
                                      remain details
                                    </span>
                                  ) : null}
                                </p>
                              )}
                            </th>
                            <th className="text-success">
                              {isNaN(
                                (
                                  (+part.done_duration_a /
                                    +part.avionics_duration) *
                                  100
                                ).toFixed(2)
                              ) ? (
                                "-"
                              ) : (
                                <p>
                                  {(
                                    (+part.done_duration_a /
                                      +part.avionics_duration) *
                                    100
                                  ).toFixed(2) + " %"}

                                  {part.done_duration_a != 0 ? (
                                    <span
                                      style={{
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                        marginLeft: "10px",
                                        fontSize: "12px",
                                        color: "blue",
                                      }}
                                      onClick={() => {
                                        setDetailsModal({
                                          index: true,
                                          part_id: part.recorded_a_id,
                                        });
                                      }}
                                    >
                                      remain tasks
                                    </span>
                                  ) : null}
                                </p>
                              )}
                              {/* 
                              {isNaN(
                                (
                                  (+part.done_duration_a /
                                    +part.avionics_duration) *
                                  100
                                ).toFixed(2)
                              )
                                ? "-"
                                : (
                                    (+part.done_duration_a /
                                      +part.avionics_duration) *
                                    100
                                  ).toFixed(2) + " %"} */}
                            </th>
                          </tr>
                        </React.Fragment>
                      );
                    })}

                    <tr>
                      <th className="bg-dark text-white">Applicable Parts</th>
                      <th colSpan={2}>
                        <Pie
                          data={chart2}
                          options={{ maintainAspectRatio: false }}
                          width={200}
                          height={200}
                        />
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}

        <h1 className="col-12 text-center mb-3 fs-4 report-header">
          Aircraft Progress Report
        </h1>
        <h5 className="col-12 text-center widget text-white">
          Full Aircraft Percentage : {finalPercentage} %
        </h5>
        <div
          style={{ position: "relative" }}
          className="col-12 d-flex flex-wrap gap-3 gap-md-0 align-items-start flex-md-nowrap report-body"
        >
          <div className="col-12 col-md-3 d-flex order-2 order-md-1 widget">
            <table className="table table-bordered table-dark text-center table-hover">
              <thead>
                <tr>
                  {/* <th className="col-1">-</th> */}
                  <th className="col-6">SB NO</th>
                  <th className="col-6"> % Progress</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((sb, index) => {
                  return (
                    <tr key={index} onClick={() => setModalIndex(index)}>
                      {/* <td>{index + 1}</td> */}
                      <td>{sb.sb_name}</td>
                      <td>
                        {sb.sb_done_percentage == 0
                          ? "-"
                          : sb.sb_done_percentage + "%"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div
            id="chart"
            className="col-12 col-md-9 d-flex order-1 order-md-2 col-md-9 widget"
          >
            <Bar options={options} data={chart1_data} />
          </div>
        </div>
      </div>

      {detailsModal.index ? <PartDetails /> : null}
    </div>
  );
}
