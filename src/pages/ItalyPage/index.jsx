import "./index.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { $Server } from "@/store";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

export default function ItalyPage() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Line Chart - Multi Axis",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "right",
      },
      // y1: {
      //   type: "linear",
      //   display: true,
      //   position: "right",
      //   grid: {
      //     drawOnChartArea: false,
      //   },
      // },
    },
  };
  const labels = [
    "01-May",
    "01-Jun",
    "01-Jul",
    "01-Aug",
    "01-Sep",
    "01-Oct",
    "01-Nov",
  ];
  const data = {
    labels,
    datasets: [
      {
        label: "Uniform Progress",
        data: [0, 15, 30, 45, 60, 75, 100],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        // yAxisID: "y",
      },
      {
        label: "Actual Progress",
        data: [0, 23, 29],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        // yAxisID: "y",
      },
    ],
  };
  const [Server_Url] = useRecoilState($Server);
  const params = useParams();

  const [tableData, setTableData] = useState([]);

  const groupBySbNo = (data) => {
    return data.reduce((acc, curr) => {
      (acc[curr.sb_no] = acc[curr.sb_no] || []).push(curr);
      return acc;
    }, {});
  };

  const getData = async () => {
    await axios
      .get(`${Server_Url}/php/index.php/api/kpi/${params.aircraft_sn}`)
      .then((res) => {
        let final = groupBySbNo(res.data.data["report_1"]);
        let finalArr = [];
        for (const key in final) {
          let issued_duration = 0;
          let estimated_duration = 0;
          let estimated_done_duration = 0;
          let actual_duration = 0;

          final[key].forEach((part) => {
            actual_duration += part.actual_duration;
            issued_duration += part.issued_duration;
            estimated_duration += part.estimated_duration;
            estimated_done_duration += part.estimated_done_duration;
          });

          let newObj = {
            sb_progress: Math.round(
              (estimated_done_duration / estimated_duration) * 100
            ),
            sb_name: key,
            parts: final[key],
            issued_duration: issued_duration,
            estimated_duration: estimated_duration,
            actual_duration: actual_duration,
          };
          finalArr.push(newObj);
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
        setTableData(finalArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getData();
    // console.log(params.aircraft_sn);
  }, []);
  return (
    <div className="col-12 bg-white p-3 d-flex flex-wrap" id="kpiReport">
      <h1 className="col-12">Time Compare</h1>
      <section className="col-12 container d-flex gap-3">
        <div className="col-12 col-md-8 d-flex">
          <table className="table table-bordered table-hover table-dark">
            <thead>
              <tr>
                <th>-</th>
                <th>SB No</th>
                <th>SB Progress</th>
                <th>Leonardo Issued Duration</th>
                <th>IPACO Estimated Duration</th>
                <th>Delta</th>
                <th>Actual Work Duration</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((sb, index) => {
                console.log(sb);
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{sb.sb_name}</td>
                    <td>{sb.sb_progress} %</td>
                    <td>
                      {sb.issued_duration == 0
                        ? "XXX"
                        : sb.issued_duration + " MNH"}
                    </td>
                    <td>
                      {sb.estimated_duration == 0
                        ? "XXX"
                        : sb.estimated_duration + " MNH"}
                    </td>
                    <td
                      className={
                        sb.issued_duration - sb.estimated_duration > 0
                          ? "bg-success"
                          : " bg-danger"
                      }
                    >
                      {sb.issued_duration - sb.estimated_duration}
                    </td>
                    <td>{sb.actual_duration}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="col-12 col-md-4 d-flex">
          <Line options={options} data={data} />;
        </div>
      </section>
    </div>
  );
}
