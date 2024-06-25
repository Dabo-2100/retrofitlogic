import { useEffect, useState } from "react";
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
import { getDueDate } from "../../Apps/Projects/components/customHooks";

export default function ReportsPage() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

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
  const [chart1_data, setChart1_data] = useState({
    labels: ["jan", "feb"],
    datasets: [{ label: "Dataset 1", data: [200, 300, 400, 1000] }],
  });

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
        finalArr.forEach((el) => {
          finalLabels.push(el.sb_name);
        });
        let finalData = [];
        finalArr.forEach((el) => {
          finalData.push(el.sb_done_percentage);
        });

        let obj = {
          labels: finalLabels,
          datasets: [
            { label: "SB.No", data: finalData, backgroundColor: "#7824F6" },
          ],
        };
        setChart1_data(obj);
        setReportData(finalArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getReportData();
    let due = getDueDate("2024-06-25 10:15:00", 0.25);
    console.log(due);
  }, []);
  return (
    <div className="col-12 d-flex justify-content-center" id="Report">
      <div className="reportPage container text-white col-12 d-flex flex-column align-items-center">
        <h1 className="col-12 text-center report-header">
          Aircraft : 49064 Progress Report
        </h1>
        {/* <p className="col-8 text-center report-desc">
          This report provides a detailed breakdown of the marketing budget,
          showcasing how resources are allocated across various channels and
          campaigns.
        </p> */}
        <div className="col-12 d-flex gap-4 report-body">
          <div className="col-3 widget">
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
                    <tr key={index}>
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
          <div className="col-9 widget" style={{ position: "relative" }}>
            <div
              className="col-12 widget"
              style={{
                border: "1px solid grey",
                boxShadow: "1px 1px 1px grey",
                padding: "1rem",
                top: 0,
                position: "sticky",
              }}
            >
              <Bar
                style={{ height: "90vh" }}
                options={options}
                data={chart1_data}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
