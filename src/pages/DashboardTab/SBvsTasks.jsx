import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useRecoilState } from "recoil";
import { $LoaderIndex, $Server } from "../../store";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SBvsTasks() {
  function orderByName(a, b) {
    if (a.sb_no > b.sb_no) {
      return 1;
    } else if (a.sb_no < b.sb_no) {
      return -1;
    } else {
      return 0;
    }
  }
  const [loaderIndex, setLoaderIndex] = useRecoilState($LoaderIndex);
  const [server] = useRecoilState($Server);
  const [options] = useState({
    responsive: true,
    // plugins: {
    //   legend: {
    //     position: "top",
    //   },
    //   title: {
    //     display: false,
    //     text: "Dashboard Reports",
    //   },
    // },
  });
  const [totals, setTotals] = useState({
    sbTasks: 0,
    sbNo: 0,
  });
  const [labels, setLabels] = useState([]);
  const [totalData, setTotalData] = useState({
    labels,
    datasets: [
      {
        label: "",
        data: labels.map((e) => e * 200),
        backgroundColor: "rgba(67, 142, 255, 0.9)",
      },
    ],
  });
  useEffect(() => {
    setLoaderIndex(1);
    axios
      .post(server + "/php/zoho_functions.php", {
        api_name: "getReportData",
        report_name: "SBvsTasks",
      })
      .then((res) => {
        let finalRes = res.data.sort(orderByName);
        let totalTasks = 0;
        finalRes.forEach((el) => (totalTasks += el.tasksSize));
        let o = {
          sbTasks: totalTasks,
          sbNo: finalRes.length,
        };
        setTotals(o);
        setLoaderIndex(0);
        let final = {
          labels: finalRes.map((le) => le.sb_no),
          datasets: [
            {
              label: "SBs Progress",
              data: finalRes.map((el) => el.tasksSize),
              backgroundColor: "rgba(67, 142, 255, 0.9)",
            },
          ],
        };
        setTotalData(final);
      })
      .catch((res) => {
        setLoaderIndex(0);
        alert("Error Connection");
      });
  }, []);

  return (
    <>
      {loaderIndex == 0 ? (
        <div
          className="col-10 d-flex flex-wrap "
          style={{
            backgroundColor: "#1f242e",
            borderRadius: "10px",
            overflowX: "hidden",
          }}
        >
          <div className="col-12 reportHeader">
            <h5 className="col-12 p-3" style={{ color: "white" }}>
              SB Progress
            </h5>
            <div
              className="col-12 d-flex flex-wrap p-2"
              style={{ backgroundColor: "#2b313e", color: "white" }}
            >
              <div className="col-6  ">
                <h5 className="col-12 text-center">{totals.sbNo}</h5>
                <p className="col-12 text-center">Total Service Bulltiens</p>
              </div>
              <div className="col-6">
                <h5 className="col-12 text-center">{totals.sbTasks}</h5>
                <p className="col-12 text-center">Total SB Tasks </p>
              </div>
            </div>
          </div>
          <div className="col-12 reportBody p-2">
            <Bar className="col-12" options={options} data={totalData} />
          </div>
        </div>
      ) : null}
    </>
  );
}
