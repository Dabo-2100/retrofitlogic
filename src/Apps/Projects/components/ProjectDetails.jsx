import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ProjectsContext } from "../ProjectsContext";
import { useRecoilState } from "recoil";
import { $Token, $Server } from "@/store";
import Tasklist from "./Tasklist";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faHome,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
export default function ProjectDetails() {
  const navigate = useNavigate();
  const [Server_Url] = useRecoilState($Server);
  const [token] = useRecoilState($Token);
  const {
    project_id,
    reloadTasklistsIndex,
    reloadProjects,
    openModal,
    project_name,
  } = useContext(ProjectsContext);
  const [allTasklists, setAllTasklists] = useState([]);
  const getProjectTaskLists = () => {
    axios
      .get(`${Server_Url}/php/index.php/api/projects/${project_id}/tasklists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (!res.data.err) {
          setAllTasklists(res.data.data);
        } else {
          setAllTasklists([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getProjectTaskLists();
  }, [reloadTasklistsIndex]);
  return (
    <div className="col-12">
      <div className="col-12 d-flex flex-wrap gap-1 p-3">
        <div className="col-12 pb-3 d-flex justify-content-between align-items-between">
          <div className="d-flex gap-3" style={{ color: "white" }}>
            <FontAwesomeIcon icon={faHouse} />
            <FontAwesomeIcon icon={faAngleRight} />
            <p className="m-0">{project_name}</p>
          </div>
          <button className="btn btn-success" onClick={() => openModal(3)}>
            New Tasklist
          </button>
        </div>
        <table className="table col-12 table-dark table-bordered mb-0">
          <thead>
            <tr>
              <td style={{ width: "4%" }}>-</td>
              <td style={{ width: "26%" }}>Task name</td>
              <td style={{ width: "20%" }}>% Progress</td>
              <td style={{ width: "15%" }}>Start date</td>
              <td style={{ width: "15%" }}>End date</td>
              <td style={{ width: "10%" }}>Duration</td>
              <td style={{ width: "10%" }}>Status</td>
            </tr>
          </thead>
        </table>
        {allTasklists.map((tasklist, index) => {
          return (
            <div
              key={tasklist.tasklist_id}
              className="col-12 tasklistRow d-flex flex-wrap gap-0"
            >
              <Tasklist
                id={tasklist.tasklist_id}
                name={tasklist.tasklist_name}
                progress={tasklist.tasklist_progress.toFixed(2)}
                startDate={tasklist.tasklist_start_date}
                endDate={tasklist.tasklist_end_date}
                duration={tasklist.tasklist_duration}
                status={tasklist.tasklist_status_name}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
