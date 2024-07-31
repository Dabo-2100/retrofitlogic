import { useContext, useEffect, useRef, useState } from "react";
import { ProjectsContext } from "../ProjectsContext";
import {
  useAllTeams,
  useProjectStatus,
  useProjectTaskLists,
  getDueDate,
  getTodayDate,
} from "../components/customHooks";
import axios from "axios";
import { useRecoilState } from "recoil";
import { $Server, $Token, $LoaderIndex } from "@/store";
import Swal from "sweetalert2";
export default function AddTask() {
  const [, setLoaderIndex] = useRecoilState($LoaderIndex);
  const { closeModal, project_id, list_id, reloadCertainTaskList } =
    useContext(ProjectsContext);
  const [durationIndex, setDurationIndex] = useState(false);
  const taskStatus = useProjectStatus();
  const projectTasklists = useProjectTaskLists(project_id);
  const [listName, setListName] = useState();
  const [Server_Url] = useRecoilState($Server);
  const [token] = useRecoilState($Token);
  const task_name = useRef();
  const task_desc = useRef();
  const task_status_id = useRef();
  const task_duration = useRef();
  const duration_type = useRef();
  const task_start_date = useRef();
  const allTeams = useAllTeams();
  const task_team_id = useRef();
  const tasklist_id = useRef();

  const checkNewTaskName = async () => {
    let Final = 0;
    await axios
      .post(
        `${Server_Url}/php/index.php/api/tasks/check`,
        {
          task_name: task_name.current.value,
          tasklist_id: list_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        Final = res.data.err ? 1 : 0;
        console.log(res.data);
      });
    return Final;
  };

  const handleSubmit = () => {
    event.preventDefault();
    let taskObj = {
      task_name: task_name.current.value,
      task_desc: task_desc.current.value,
      tasklist_id: list_id,
      task_progress: 0,
      task_status_id: task_status_id.current.value,
      task_duration: task_duration.current.value * duration_type.current.value,
    };

    checkNewTaskName().then((res) => {
      setLoaderIndex(1);
      res == 0
        ? axios
            .post(`${Server_Url}/php/index.php/api/tasks/store`, taskObj, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              reloadCertainTaskList(list_id);
              if (!res.data.err) {
                setLoaderIndex(0);
                Swal.fire({
                  icon: "success",
                  text: "Task added successfuly",
                  timer: 1500,
                });
                closeModal();
              }
            })
        : Swal.fire({
            icon: "error",
            text: "Task name is already exsist !",
            timer: 1500,
          }).then(() => {
            setLoaderIndex(0);
          });
    });
  };

  useEffect(() => {
    let list = projectTasklists.find((el) => {
      return el.tasklist_id == list_id;
    });
    list ? setListName(list.tasklist_name) : null;
  }, [projectTasklists]);

  return (
    <div
      id="addTaskModal"
      className="Modal"
      onClick={() => {
        Swal.fire({
          icon: "question",
          text: "Are you sure you want close ?",
          showConfirmButton: true,
          showDenyButton: true,
        })
          .then((res) => {
            if (res.isConfirmed) {
              closeModal();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }}
    >
      <div
        className="content d-flex flex-wrap align-items-start align-content-start animate__animated animate__fadeInRight"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <h5 className="header col-12 p-3">Add New Task</h5>
        <p className="col-12 text-white px-3 mb-3">To : {listName}</p>
        <form
          onSubmit={handleSubmit}
          className="col-12 px-3 gap-3 d-flex flex-wrap"
        >
          <div className="col-12 d-flex flex-wrap gap-2">
            <label className="col-12">
              Task name <span className="required">*</span>
            </label>
            <input
              className="col-12 form-control"
              ref={task_name}
              type="text"
              required
            />
          </div>

          <div className="col-12 d-flex flex-wrap gap-2">
            <label className="col-12">Task Description</label>
            <textarea
              className="col-12 form-control"
              ref={task_desc}
              required
            />
          </div>
          {/* 
          <div className="col-12 d-flex flex-wrap gap-2">
            <label className="col-12">Associated Team</label>
            <select
              className="col-12 form-select"
              ref={task_team_id}
              defaultValue={-1}
            >
              <option value={-1} hidden disabled>
                Select Team
              </option>
              {allTeams.map((team, index) => {
                return (
                  <option key={team.team_id} value={team.team_id}>
                    {team.team_name}
                  </option>
                );
              })}
            </select>
          </div> */}

          <div className="col-12 d-flex flex-wrap gap-2">
            <label className="col-12">Task Status</label>
            <select
              className="col-12 form-select"
              ref={task_status_id}
              defaultValue={-1}
            >
              <option value={-1} hidden disabled>
                Select Status
              </option>
              {taskStatus.map((task, index) => {
                return (
                  <option key={task.status_id} value={task.status_id}>
                    {task.status_name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* <div className="col-12 d-flex flex-wrap gap-2">
            <label className="col-12">Tasklist</label>
            <select
              defaultValue={list_id}
              onChange={(e) => {
                // console.log(e.target.value);
              }}
              className="col-12 form-select"
              ref={tasklist_id}
            >
              {projectTasklists.map((list) => {
                return (
                  <option key={list.tasklist_id} value={list.tasklist_id}>
                    {list.tasklist_name}
                  </option>
                );
              })}
            </select>
          </div> */}

          {/* <div className="col-12 d-flex flex-wrap gap-2">
            <label>
              Start Date <span className="required">*</span>
            </label>
            <div className="col-12 d-flex">
              <input
                ref={task_start_date}
                className="form-control"
                type="datetime-local"
                defaultValue={getTodayDate() + "T08:00"}
                min={"T08:00"}
                required
              />
            </div>
          </div> */}

          {durationIndex ? (
            <div className="d-flex flex-wrap gap-2 col-12">
              <div className="col-12 d-flex justify-content-between">
                <label>Due Date</label>
                <p
                  style={{ color: "rgb(0, 167, 246)" }}
                  onClick={() => setDurationIndex(!durationIndex)}
                >
                  Enter Duration
                </p>
              </div>
              <div className="col-12 d-flex justify-content-between">
                <input
                  className="form-control"
                  value={getTodayDate()}
                  type="datetime-local"
                  placeholder="Enter New Task Name"
                />
              </div>
            </div>
          ) : (
            <div className="d-flex flex-wrap gap-2 col-12">
              {/* <div className="col-12 d-flex justify-content-between">
                <label>Task Duration</label>
                <p
                  style={{ color: "rgb(0, 167, 246)" }}
                  onClick={() => setDurationIndex(!durationIndex)}
                >
                  Enter End Date
                </p>
              </div> */}
              <div className="col-12 d-flex">
                <input
                  ref={task_duration}
                  className="form-control"
                  style={{ width: "60%" }}
                  type="number"
                  min="0"
                  placeholder="Enter Task duration"
                  required
                />
                <select
                  ref={duration_type}
                  className="form-select"
                  style={{ width: "40%" }}
                >
                  <option value="1">hrs</option>
                  <option value="8">days</option>
                </select>
              </div>
            </div>
          )}

          <button className="btn btn-primary">Add New</button>
        </form>
      </div>
    </div>
  );
}
