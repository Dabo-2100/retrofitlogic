import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil"
import { $Token, $Server } from "@/store";
import { ProjectsContext } from "../ProjectsContext"
import axios from "axios";
import ProgressBar from "./ProgressBar";

export default function Tasklist(props) {
    const { project_id, openModal, setTasklist_id, reloadTasklistsIndex } = useContext(ProjectsContext);
    const [collapseIndex, setCollapseIndex] = useState(false);
    const [Server_Url] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [tasks, setTasks] = useState([]);

    const getTasklistTasks = () => {
        axios.get(`${Server_Url}/php/index.php/api/projects/${project_id}/tasklists/${props.id}/tasks`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {
            if (!res.data.err) {
                setTasks(res.data.data);
            }
            else {
                setTasks([]);
            }
        }).catch((err) => {
            console.log(err);
        })

    }

    const handleAddTask = () => {
        openModal(2);
        setTasklist_id(props.id);
    }

    const handleAddTasklist = () => {
        openModal(3);
    }
    useEffect(() => {
        getTasklistTasks();
        console.log('Updated From tasklist');
    }, [reloadTasklistsIndex])
    return (
        <div className={`col-12 Tasklist d-flex flex-wrap ${props.type}`}>
            <table className="col-12 table table-bordered table-dark mb-0">
                <tbody>
                    <tr style={{ backgroundColor: "#252628" }}>
                        <th style={{ width: "4%" }} onClick={() => { setCollapseIndex(!collapseIndex); getTasklistTasks() }}>
                            <FontAwesomeIcon icon={collapseIndex ? faChevronDown : faChevronRight} />
                        </th>
                        <th style={{ width: "26%" }}>{props.name}</th>
                        <th style={{ width: "20%" }}>{props.progress ? props.progress : 0} %</th>
                        <th style={{ width: "15%" }}>{props.startDate}</th>
                        <th style={{ width: "15%" }}>{props.endDate}</th>
                        <th style={{ width: "10%" }}>{props.duration} Hrs</th>
                        <th style={{ width: "10%" }}>{props.status}</th>
                    </tr>
                </tbody>
            </table>
            {
                collapseIndex ? (
                    <table className="col-12 table table-bordered table-dark mb-0 listTasks">
                        <tbody>
                            {
                                tasks.map((task, index) => {
                                    return (
                                        <tr key={task.task_id}>
                                            <td style={{ width: "4%" }}><input type="checkbox" /></td>
                                            <td style={{ width: "26%", textDecoration: `${task.task_progress == 100 ? "line-through" : "none"}`, color: `${task.task_progress == 100 ? "grey" : "white"}` }}>{task.task_name}</td>
                                            <td style={{ width: "20%" }}>{<ProgressBar canEdit={true} task_id={task.task_id} progress={task.task_progress ? task.task_progress : 0} />}</td>
                                            <td style={{ width: "15%" }}>{task.task_start_date}</td>
                                            <td style={{ width: "15%" }}>{task.task_end_date}</td>
                                            <td style={{ width: "10%" }}>{task.task_duration} hrs</td>
                                            <td style={{ width: "10%" }}>{task.tasklist_status_name}</td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td></td>
                                <td>
                                    <div className="col-12 d-flex gap-2 justify-content-center">
                                        <p className="addNew" onClick={handleAddTask}>Add Task</p>
                                        <p>|</p>
                                        <p className="addNew" onClick={handleAddTasklist}>Add Tasklist</p>
                                    </div>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                ) : null
            }
        </div>
    )
}
