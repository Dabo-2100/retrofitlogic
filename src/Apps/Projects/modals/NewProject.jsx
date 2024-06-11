import { useContext, useEffect, useRef, useState } from "react"
import { ProjectsContext } from "../ProjectsContext"
import { getTodayDate, useProjectStatus } from "../components/customHooks";
import Swal from "sweetalert2";
import axios from "axios";
import { $Server, $Token } from "@/store";
import { useRecoilState } from "recoil";

export default function NewProject() {
    const [Server_Url] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const status = useProjectStatus();
    const today = getTodayDate();
    const projectName = useRef();
    const projectStatus = useRef();
    const { closeModal, reloadProjects } = useContext(ProjectsContext);
    const [projectStart, setProjectStart] = useState();
    const [minDate, setMinDate] = useState(today);
    const [projectEnd, setProjectEnd] = useState();
    const handleSubmit = () => {
        event.preventDefault();
        let project_obj = {
            table_name: "app_projects",
            Fields: ["project_name", "project_start_date", "project_end_date", "project_status_id"],
            Values: [projectName.current.value, projectStart, projectEnd, projectStatus.current.value]
        };

        axios.post(`${Server_Url}/php/index.php/api/insert`, project_obj, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {
            console.log(res.data);
            if (!res.data.err) {
                Swal.fire({
                    icon: "success",
                    text: "New project added !",
                    timer: 1500,
                    position: "top-right",
                    width: "300px",
                    showConfirmButton: false,
                    heightAuto: true,
                    padding: 0,
                }).then(() => { reloadProjects(); closeModal() })
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    useEffect(() => {
        setMinDate(projectStart);
    }, [projectStart]);

    return (
        <div className="Modal" id="newProjectModal" onClick={() => closeModal()}>
            <div className="content p-3 d-flex flex-wrap" onClick={(e) => e.stopPropagation()}>
                <h4 className="col-4 mb-4">Add New Project</h4>
                <form className="col-12 d-flex flex-wrap gap-3" onSubmit={handleSubmit}>
                    <div className="col-12 d-flex flex-wrap gap-1">
                        <label htmlFor="name" className="col-12">Project Name</label>
                        <input ref={projectName} type="text" id="name" className="form-control" placeholder="Enter Project Name Here ..." required />
                    </div>
                    <div className="col-12 d-flex justify-content-between">
                        <div className="col-5 d-flex flex-wrap gap-1">
                            <label htmlFor="startDate">Start Date</label>
                            <input id="startDate" onChange={(e) => setProjectStart(e.target.value)} type="date" className="form-control" required />
                        </div>
                        <div className="col-5 d-flex flex-wrap gap-1">
                            <label htmlFor="endDate">End Date</label>
                            <input min={minDate} id="endDate" type="date" onChange={(e) => setProjectEnd(e.target.value)} className="form-control" required />
                        </div>
                    </div>
                    <div className="col-12 d-flex flex-wrap gap-1">
                        <label className="col-12">Project Status</label>
                        <select ref={projectStatus} className="col-12 form-select" >
                            {
                                status.map((el, index) => {
                                    return <option key={el.status_id} value={el.status_id}>{el.status_name}</option>
                                })
                            }
                        </select>
                    </div>
                    <button className="col-12 btn btn-primary">Create new project</button>
                </form>
            </div>
        </div>
    )
}