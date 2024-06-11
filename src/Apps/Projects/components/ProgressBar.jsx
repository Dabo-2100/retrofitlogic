import { useContext, useRef } from "react";
import { ProjectsContext } from "../ProjectsContext";
import Swal from "sweetalert2";
import axios from "axios";
import { useRecoilState } from "recoil";
import { $Token, $Server } from "@/store";
import { useProjectStatus } from "./customHooks";

export default function ProgressBar(props) {
  const [Server_Url] = useRecoilState($Server);
  const [token] = useRecoilState($Token);
  const {
    editProgress,
    openProgressEditor,
    closeProgressEditor,
    reloadTasklists,
  } = useContext(ProjectsContext);
  const step = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const progress = useRef();
  const handleClick = () => {
    props.canEdit ? openProgressEditor(props.task_id) : null;
  };

  const app_status = useProjectStatus();
  const updateProgress = () => {
    let taskStatus = app_status.find((el) => {
      if (progress.current.value < 100) {
        return el.status_name == "Open";
      } else {
        return el.status_name == "Done";
      }
    });
    closeProgressEditor();
    let data = {
      task_progress: progress.current.value,
      task_status_id: taskStatus.status_id,
    };
    axios
      .post(
        `${Server_Url}/php/index.php/api/update`,
        {
          table_name: "project_tasks",
          data: data,
          condition: `task_id = ${props.task_id}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        reloadTasklists();
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Connection Error !",
          timer: 1000,
        });
      });
  };
  return (
    <div className="col-12 d-flex p-3 progressBar" onClick={handleClick}>
      {editProgress.index ? (
        <select
          ref={progress}
          defaultValue={props.progress}
          className="form-select"
          onChange={updateProgress}
        >
          {step.map((step, index) => {
            return (
              <option key={index} value={step}>
                {step}
              </option>
            );
          })}
        </select>
      ) : (
        <div
          className="progress col-12"
          role="progressbar"
          style={{ position: "relative", height: "1.5rem" }}
          aria-label="Success example"
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            className="progress-bar bg-success"
            style={{ width: `${props.progress}%` }}
          >
            <div
              style={{
                position: "absolute",
                left: "calc(50% - 0.8rem)",
                color: "black",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              {props.progress}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
