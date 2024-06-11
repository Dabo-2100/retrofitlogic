import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useRecoilState } from "recoil";
import { $Server, $Token, $LoaderIndex } from "@/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClone,
  faObjectUngroup,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { ProjectsContext } from "../ProjectsContext";
import Swal from "sweetalert2";

export default function ProjectsList() {
  const [Server_Url] = useRecoilState($Server);
  const [token] = useRecoilState($Token);
  const [, setLoaderIndex] = useRecoilState($LoaderIndex);
  const [allProjects, setAllProjects] = useState([]);
  const {
    menuIndex,
    openMenu,
    project_id,
    setProject_id,
    setProject_name,
    openSlide,
    openModal,
    reloadProjectsIndex,
  } = useContext(ProjectsContext);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  const getAllProjects = () => {
    setLoaderIndex(1);
    axios
      .get(`${Server_Url}/php/index.php/api/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((Res) => {
        let res = Res.data;
        console.log(res);
        setAllProjects(res.data);
        setLoaderIndex(0);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRightClick = (project_id, project_name) => {
    event.preventDefault();
    setMenuPos({ x: event.clientX, y: event.clientY });
    openMenu();
    setProject_id(project_id);
    setProject_name(project_name);
  };

  const trashProject = () => {
    Swal.fire({
      icon: "question",
      html: `
                <div class="col-12 d-flex flex-wrap gap-2">
                    <h3 class="col-12">Are you sure you want to remove that project ?</h3>
                    <h5 class="col-12 text-start mt-2">This will includes removing of </h5>
                    <ul class="col-12">
                        <li class="text-start">All Tasklists</li>
                        <li class="text-start">All Tasks</li>
                        <li class="text-start">All Progress</li>
                    </ul>
                </div>
            `,
      confirmButtonText: "Yes, Remove it",
      denyButtonText: "No, Please",
      showDenyButton: true,
      confirmButtonColor: "#dc3741",
      denyButtonColor: "#7066e0",
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({
          icon: "success",
          text: "Project removed succefuly !",
          timer: 1500,
        });
      }
    });
  };

  const cloneProject = () => {
    alert(`you want to clone ${project_id}`);
  };

  useEffect(() => {
    getAllProjects();
  }, [reloadProjectsIndex]);

  return (
    <div className="col-12 p-3 d-flex flex-wrap gap-2" id="ProjectsList">
      {menuIndex ? (
        <ul
          className="freeMenu p-0 d-flex flex-column gap-1 p-2"
          style={{ top: menuPos.y + "px", left: menuPos.x + "px" }}
        >
          {/* <li className="d-flex gap-2 p-2"><FontAwesomeIcon icon={faObjectUngroup} /> Access Project in New Tab</li> */}
          <li className="d-flex gap-2 p-2" onClick={() => openSlide(2)}>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} /> Access Project
          </li>
          <li className="d-flex gap-2 p-2" onClick={() => openSlide(3)}>
            <FontAwesomeIcon icon={faPenToSquare} /> Edit Project
          </li>
          <li
            className="d-flex gap-2 p-2"
            onClick={trashProject}
            style={{ color: "rgb(255, 49, 55)" }}
          >
            <FontAwesomeIcon icon={faTrashCan} /> Remove Project
          </li>
          <li className="d-flex gap-2 p-2" onClick={cloneProject}>
            <FontAwesomeIcon icon={faClone} />
            Clone Project
          </li>
        </ul>
      ) : null}
      <header className="col-12 d-flex justify-content-between">
        <h1 className="header">All Projects</h1>
        <div className="actions">
          <button className="btn btn-success" onClick={() => openModal(1)}>
            New Project
          </button>
        </div>
      </header>
      <table className="col-12 table table-bordered table-dark table-hover">
        <thead>
          <tr>
            <th>-</th>
            <th>Project Name</th>
            <th>Starting Date</th>
            <th>Due Date</th>
            <th>Duration</th>
            <th>Progress %</th>
            <th>Status </th>
          </tr>
        </thead>
        <tbody>
          {allProjects.map((project, index) => {
            return (
              <tr
                key={project.project_id}
                onContextMenu={() =>
                  handleRightClick(project.project_id, project.project_name)
                }
              >
                <td>{index + 1}</td>
                <td>{project.project_name}</td>
                <td>{project.project_start_date}</td>
                <td>{project.project_end_date}</td>
                <td>
                  {project.project_duration ? project.project_duration : "-"}
                </td>
                <td>{project.project_progress.toFixed(2)}</td>
                <td>{project.project_status_name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
