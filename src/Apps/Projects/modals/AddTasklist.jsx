import { useContext, useEffect, useRef, useState } from "react";
import { ProjectsContext } from "../ProjectsContext";
import axios from "axios";
import { useRecoilState } from "recoil";
import { $Server, $Token, $LoaderIndex } from "@/store";
import Swal from "sweetalert2";
import { getDueDate } from "../components/customHooks";

export default function AddTasklist() {
  const [Server_Url] = useRecoilState($Server);
  const [token] = useRecoilState($Token);
  const [, setLoaderIndex] = useRecoilState($LoaderIndex);
  const { project_id, closeModal, reloadTasklists } =
    useContext(ProjectsContext);
  const [fromTemplateIndex, setFromTemplateIndex] = useState(true);
  const [allTemplates, setAllTemplates] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  

  const selectList = useRef();

  async function submitTasks(tasks, startDate, tasklist_id) {
    let sDate = startDate;
    for (let index = 0; index < tasks.length; index++) {
      let task = tasks[index];
      let order = index + 1;
      let eDate = getDueDate(sDate, task.task_duration);
      let taskObj = {
        task_start_date: sDate,
        task_end_date: eDate,
        task_name: task.task_name,
        task_duration: task.task_duration,
        task_desc: task.task_desc,
        tasklist_id: tasklist_id,
        task_order: order,
        task_status_id: 1,
      };
      try {
        let response = await axios.post(
          `${Server_Url}/php/index.php/api/insert`,
          {
            table_name: "project_tasks",
            Fields: Object.keys(taskObj),
            Values: Object.values(taskObj),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        sDate = eDate;
      } catch (error) {
        console.error(`Error submitting task ${order}:`, error);
      }
    }
    Swal.fire({
      icon: "success",
      text: "Tasklist added successfuly to your project",
      timer: 1500,
    }).then(() => {
      setLoaderIndex(0);
      reloadTasklists();
      closeModal();
    });
  }

  const getAllTemplates = () => {
    axios
      .get(`${Server_Url}/php/index.php/api/tasklists/istemplate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (!res.data.err) {
          setAllTemplates(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = () => {
    let val = selectList.current.value;

    let obj = allTemplates.find((el) => {
      return el.tasklist_name.toLowerCase() == val.toLowerCase();
    });

    obj ? setSelectedList(obj) : setSelectedList(null);
  };

  const handleClose = () => {
    Swal.fire({
      icon: "question",
      text: "Are you sure you want to close that modal ?",
      showDenyButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        closeModal();
      }
    });
  };

  const createTasklist = async () => {
    return new Promise(async (reslove, reject) => {
      let tasklistObj = {
        project_id: project_id,
        tasklist_name: selectedList.tasklist_name,
        tasklist_status_id: 1,
        is_template: false,
      };
      let res = await axios.post(
        `${Server_Url}/php/index.php/api/insert`,
        {
          table_name: "project_tasklists",
          Fields: Object.keys(tasklistObj),
          Values: Object.values(tasklistObj),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.data.err) {
        reslove(res.data.data.id);
      } else {
        reject(false);
      }
    });
  };

  const startDateInput = useRef();
  const handleSubmit = async () => {
    setLoaderIndex(1);
    // get selected tasklist "Tasks"
    let tasklist_id = selectedList.tasklist_id;
    try {
      let res = await axios.get(
        `${Server_Url}/php/index.php/api/tasklists/${tasklist_id}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let tasks = res.data.data;
      createTasklist().then((res) => {
        let newTasklist_id = +res;
        submitTasks(tasks, startDateInput.current.value, newTasklist_id);
      });
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    getAllTemplates();
  }, []);

  return (
    <div className="Modal" id="addTasklistModal" onClick={handleClose}>
      <div
        className="content p-3 d-flex flex-wrap align-items-start align-content-start animate__animated animate__fadeInRight"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="col-12 header py-2 px-5">Add new tasklist</h3>
        <datalist id="allTemplates">
          {allTemplates.map((list, index) => {
            return (
              <option
                value={list.tasklist_name}
                data-id={list.tasklist_id}
                key={list.tasklist_id}
              ></option>
            );
          })}
        </datalist>

        {fromTemplateIndex ? (
          <div className="col-12">
            <h1>use template</h1>
            <input
              onChange={handleChange}
              ref={selectList}
              className="col-12 form-control"
              placeholder="Search for tasklist"
              list="allTemplates"
            />
            {selectedList ? (
              <>
                <table className="table table-dark">
                  <tbody>
                    <tr>
                      <th>Tasklist Name </th>
                      <td>{selectedList.tasklist_name}</td>
                    </tr>
                    <tr>
                      <th>Tasklist Duration </th>
                      <td>{selectedList.tasklist_duration}</td>
                    </tr>
                    <tr>
                      <th>Tasklist Start Date</th>
                      <td>
                        <input
                          className="form-control"
                          type="datetime-local"
                          ref={startDateInput}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Add Tasklist
                </button>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
