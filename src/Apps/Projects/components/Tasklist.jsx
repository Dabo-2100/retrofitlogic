import {
  faChevronDown,
  faChevronRight,
  faComment,
  faDownLeftAndUpRightToCenter,
  faPaperPlane,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { $Token, $Server, $LoaderIndex } from "@/store";
import { ProjectsContext } from "../ProjectsContext";
import axios from "axios";
import ProgressBar from "./ProgressBar";
import { getDueDate, useProjectStatus } from "./customHooks";
import Swal from "sweetalert2";

export default function Tasklist(props) {
  const tasklist = useRef();
  const {
    setTask_id,
    taskListContext: contextIndex,
    setTaskListContext: setContextIndex,
    project_id,
    openModal,
    setTasklist_id,
    reloadTasklistsIndex,
    reloadTasklists,
    filter,
  } = useContext(ProjectsContext);
  const Status = useProjectStatus();

  const [Server_Url] = useRecoilState($Server);
  const [token] = useRecoilState($Token);

  const [tasks, setTasks] = useState([]);
  const [collapseIndex, setCollapseIndex] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [dateIndex, setDateIndex] = useState(null);

  const [selectedTasks, setSelectedTasks] = useState([]);
  const [, setLoaderIndex] = useRecoilState($LoaderIndex);

  const getTasklistTasks = () => {
    setSelectedTasks([]);
    if (filter.data.status == 0) {
      axios
        .get(
          `${Server_Url}/php/index.php/api/projects/${project_id}/tasklists/${props.id}/tasks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (!res.data.err) {
            setTasks(res.data.data);
          } else {
            setTasks([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .post(
          `${Server_Url}/php/index.php/api/projects/${project_id}/tasklists/${props.id}/tasks`,
          {
            task_status_id: filter.data.status,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (!res.data.err) {
            setTasks(res.data.data);
          } else {
            setTasks([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleAddTask = () => {
    openModal(2);
    setTasklist_id(props.id);
  };

  const handleAddTasklist = () => {
    openModal(3);
  };

  const updateStatus = async (task_id, newStatus, oldVal = 0) => {
    let data = {};
    if (oldVal == 4) {
      data.task_progress = 0;
    }
    if (newStatus == 4) {
      data.task_progress = 100;
    }
    data.task_status_id = newStatus;
    let res = await axios.post(
      `${Server_Url}/php/index.php/api/update`,
      {
        table_name: "project_tasks",
        data: data,
        condition: `task_id = ${task_id}`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    reloadTasklists();
    setEditIndex(null);
    // alert(`Change task : ${task_id} to ${newStatus}`);
  };

  const updateDate = async (event) => {
    let newdate = event.target.value;
    let newStart = newdate.split("T")[0] + " " + newdate.split("T")[1]; // Ensure date format is consistent

    const confirmation = await Swal.fire({
      showDenyButton: true,
      icon: "question",
      text: `Are you sure you want to change the start date of ${props.name} to ${newStart}?`,
    });

    if (confirmation.isConfirmed) {
      setLoaderIndex(1);

      try {
        for (const task of tasks) {
          let newDue = getDueDate(newStart, task.task_duration);
          let data = {
            task_start_date: newStart,
            task_end_date: newDue,
          };

          await axios.post(
            `${Server_Url}/php/index.php/api/update`,
            {
              table_name: "project_tasks",
              data: data,
              condition: `task_id = ${task.task_id}`,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          newStart = newDue; // Update newStart after successful post
        }
      } catch (error) {
        console.error("Error updating tasks:", error);
        // Optionally, add user feedback for errors here
      } finally {
        setLoaderIndex(0);
        reloadTasklists();
        setDateIndex(null);
        // Optionally, show success message
        // Swal.fire("Done");
      }
    }
  };

  const unSelectAll = () => {
    let obj = tasklist.current;
    let inputs = obj.querySelectorAll("input:checked");
    inputs.forEach((input) => {
      input.checked = false;
    });
  };
  const handleMultiChange = () => {
    let newValue = event.target.value;
    let updatePromises = selectedTasks.map((id) => updateStatus(id, newValue));
    Promise.all(updatePromises)
      .then(() => {
        setSelectedTasks([]);
        reloadTasklists();
        unSelectAll();
      })
      .catch((error) => {
        console.error("Error updating tasks:", error);
      });
  };

  const toggleSelectedTask = (task_id) => {
    // selectedTasks
    let tasks = [...selectedTasks];

    let index = selectedTasks.findIndex((el) => {
      return el == task_id;
    });

    if (event.target.checked == true) {
      tasks.push(task_id);
    } else {
      tasks.splice(index, 1);
    }
    setSelectedTasks(tasks);
    // console.log(tasks);
  };

  const handleRightClick = (task_id) => {
    setTask_id(task_id);
    console.log(`Task id : ${task_id}`);
    event.preventDefault();
    setContextIndex({
      index: true,
      x: event.clientX,
      y: event.clientY,
    });
    // alert(props.id);
  };

  useEffect(() => {
    getTasklistTasks();
  }, [reloadTasklistsIndex]);

  return (
    <>
      {tasks.length != 0 ? (
        <div
          className={`col-12 Tasklist d-flex flex-wrap ${props.type}`}
          ref={tasklist}
        >
          {selectedTasks.length != 0 ? (
            <div className="col-12 d-flex gap-3 align-items-center text-white bg-danger p-3 sticky-top ">
              <label className="text-center col-3">Change Tasks Status</label>
              <select
                className="form-select"
                onChange={handleMultiChange}
                defaultValue={0}
              >
                <option value={0} hidden disabled>
                  Task Status
                </option>
                {Status.map((el) => {
                  return (
                    <option value={el.status_id} key={el.status_id}>
                      {el.status_name}
                    </option>
                  );
                })}
              </select>
            </div>
          ) : null}

          {contextIndex.index ? (
            <div
              id="taskActions"
              className="bg-dark d-flex flex-column gap-1 p-2 text-white rounded"
              style={{
                left: contextIndex.x,
                top: contextIndex.y,
                position: "fixed",
              }}
            >
              <div
                className="col-12 d-flex align-item-center gap-3 p-2"
                onClick={() => openModal(5)}
              >
                <FontAwesomeIcon icon={faComment} />
                <p>Add Comment</p>
              </div>
              <div className="col-12 d-flex align-item-center gap-3 p-2">
                <FontAwesomeIcon icon={faPenToSquare} />
                <p>Rename Task</p>
              </div>
              <div className="col-12 d-flex align-item-center gap-3 p-2">
                <FontAwesomeIcon icon={faDownLeftAndUpRightToCenter} />
                <p>Move Task</p>
              </div>
            </div>
          ) : null}

          <table className="col-12 table table-bordered table-dark mb-0">
            <tbody>
              <tr style={{ backgroundColor: "#252628" }}>
                <th
                  print="false"
                  style={{ width: "4%" }}
                  onClick={() => {
                    setCollapseIndex(!collapseIndex);
                    getTasklistTasks();
                  }}
                >
                  <FontAwesomeIcon
                    icon={collapseIndex ? faChevronDown : faChevronRight}
                  />
                </th>
                <th
                  style={{
                    width: "26%",
                    textDecoration: `${
                      props.progress == 100 ? "line-through" : "none"
                    }`,
                  }}
                >
                  {props.name}
                </th>
                <th style={{ width: "20%" }}>
                  <span
                    className="col-12"
                    style={{
                      color: `${props.progress == 100 ? "#198754" : null}`,
                      fontWeight: `${props.progress == 100 ? 700 : 400}`,
                    }}
                  >
                    {props.progress ? Math.trunc(props.progress) : 0} %
                  </span>
                </th>
                <th style={{ width: "15%" }} print="false">
                  {props.startDate}
                </th>
                <th style={{ width: "15%" }} print="false">
                  {props.endDate}
                </th>
                {/* <th style={{ width: "15%" }}>-</th> */}
                <th style={{ width: "10%" }} print="false">
                  {Math.ceil(props.duration)} Hrs
                </th>
                {/* <th style={{ width: "10%" }}>{props.status}</th> */}
                <th style={{ width: "10%" }} print="false">
                  -
                </th>
              </tr>
            </tbody>
          </table>
          {collapseIndex ? (
            <table
              // onContextMenu={(event) => event.stopPropagation()}
              className="col-12 table table-bordered table-dark mb-0 listTasks"
            >
              <tbody>
                {tasks.map((task, index) => {
                  return (
                    <tr
                      key={task.task_id}
                      onContextMenu={() => handleRightClick(task.task_id)}
                    >
                      <td style={{ width: "4%" }} print="false">
                        <input
                          style={{ cursor: "pointer", scale: "1.2" }}
                          className="form-check-input"
                          type="checkbox"
                          onClick={() => toggleSelectedTask(task.task_id)}
                        />
                      </td>
                      <td
                        style={{
                          width: "10%",
                          textDecoration: `${
                            task.task_progress == 100 ? "line-through" : "none"
                          }`,
                          color: `${
                            task.task_progress == 100 ? "grey" : "white"
                          }`,
                        }}
                      >
                        <div className="col-12 d-flex gap-3 justify-content-center">
                          <p>{task.task_name}</p>
                          {task.comment_count ? (
                            <FontAwesomeIcon
                              icon={faComment}
                              onClick={() => {
                                setTask_id(task.task_id);
                                openModal(5);
                              }}
                            />
                          ) : null}
                        </div>
                      </td>
                      <td style={{ width: "16%" }}>{task.task_desc}</td>
                      <td style={{ width: "20%" }} print="true">
                        {
                          <ProgressBar
                            status_id={task.task_status_id}
                            canEdit={true}
                            task_id={task.task_id}
                            progress={
                              task.task_progress ? task.task_progress : 0
                            }
                          />
                        }
                      </td>
                      <td
                        print="false"
                        style={{ width: "15%" }}
                        onDoubleClick={() => setDateIndex(index)}
                      >
                        {dateIndex == 0 && index == 0 ? (
                          <input
                            type="datetime-local"
                            defaultValue={task.task_start_date}
                            onChange={updateDate}
                          />
                        ) : (
                          <p className="m-0 p-0">
                            {task.task_start_date}
                            {/* {task.task_start_date.split(" ")[1]} */}
                            {/* {task.task_start_date.split(" ")[0]} <br />
                            {task.task_start_date.split(" ")[1]} */}
                          </p>
                        )}
                      </td>
                      <td print="false" style={{ width: "15%" }}>
                        {task.task_end_date}
                      </td>
                      <td print="false" style={{ width: "10%" }}>
                        {task.task_duration} hrs
                      </td>
                      <td
                        className="m-0 p-0"
                        style={{ width: "10%" }}
                        onDoubleClick={() => setEditIndex(index)}
                      >
                        <div
                          print="true"
                          className="col-12 p-2"
                          style={{
                            backgroundColor: `${task.tasklist_status_color}`,
                          }}
                        >
                          {editIndex == index ? (
                            <select
                              className="form-select"
                              defaultValue={task.task_status_id}
                              onChange={(e) => {
                                updateStatus(
                                  task.task_id,
                                  e.target.value,
                                  task.task_status_id
                                );
                              }}
                            >
                              {Status.map((status, index) => {
                                return (
                                  <option key={index} value={status.status_id}>
                                    {status.status_name}
                                  </option>
                                );
                              })}
                            </select>
                          ) : (
                            <p className="m-0 p-0">
                              {task.tasklist_status_name}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {/* <tr>
                  <td></td>
                  <td>
                    <div className="col-12 d-flex gap-2 justify-content-center">
                      <p className="addNew" onClick={handleAddTask}>
                        Add Task
                      </p>
                      <p>|</p>
                      <p className="addNew" onClick={handleAddTasklist}>
                        Add Tasklist
                      </p>
                    </div>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr> */}
              </tbody>
            </table>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
