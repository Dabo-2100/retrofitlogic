import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { $Server } from "../../store";
import { Gantt } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
export default function ProjectTab() {
  function addDays(date, days) {
    let res = date.getTime() + days * 24 * 60 * 60 * 1000;
    return new Date(res);
  }
  function getTotalOfArray(arr) {
    let x = 0;
    arr.forEach((element) => {
      x += element.tasksNo;
    });
    return x;
  }
  const [tasks, setTasks] = useState([
    {
      start: new Date(2020, 1, 1),
      end: new Date(2020, 1, 2),
      name: "Idea",
      id: "Task 0",
      type: "task",
      progress: 0,
      isDisabled: true,
      styles: {
        progressColor: "#ffbb54",
        progressSelectedColor: "#ff9e0d",
      },
    },
  ]);
  const [server] = useRecoilState($Server);
  const [allTasks, setAllTasks] = useState([]);
  const [SB_Parts, setSP_Parts] = useState([]);
  useEffect(() => {
    axios
      .post(server + "/php/zoho_functions.php", {
        api_name: "getProjectPlan",
      })
      .then((res) => {
        setAllTasks(res.data);
        let data = res.data;
        let partsObj = Object.groupBy(data, ({ SP_Part }) => SP_Part);
        let partsArr = [];
        let taskArr = [];
        let t0 = new Date("2024-03-03");
        let i = 0;
        for (const key in partsObj) {
          let partObj = {
            name: key,
            tasksNo: partsObj[key].length,
          };
          let tf = addDays(t0, partsObj[key].length / 7);

          let taskObj = {
            start: t0,
            end: tf,
            name: key,
            id: i,
            type: "task",
            progress: 45,
            isDisabled: true,
            styles: {
              progressColor: "#ffbb54",
              progressSelectedColor: "#ff9e0d",
            },
          };

          let obj = {
            SP_Name: key,
            tasksNo: partsObj[key].length,
            duration: Math.ceil(partsObj[key].length / 7),
            t0: t0,
            tf: tf,
          };
          taskArr.push(taskObj);
          partsArr.push(partObj);
          t0 = addDays(tf, 1);
          i++;
        }
        setTasks(taskArr);
        setSP_Parts(partsArr);
      });
  }, []);
  return (
    <div
      className="col-12 workingTab"
      id="ProjectTab"
      style={{ color: "white" }}
    >
      <Gantt className="col-12" tasks={tasks} />
      <h1 className="col-12">Applicablity on Aircraft : 49064</h1>
      <table className="table table-borderd table-dark">
        <thead>
          <tr>
            <th>-</th>
            <th>SB Name</th>
            <th>SB Tasks No</th>
          </tr>
        </thead>
        <tbody>
          {SB_Parts.map((SB_Part, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{SB_Part.name}</td>
                <td>{SB_Part.tasksNo}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
