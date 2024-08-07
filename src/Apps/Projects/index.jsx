import "./index.scss";
import ProjectsList from "./components/ProjectsList";
import ProjectEdit from "./components/ProjectEdit";
import ProjectDetails from "./components/ProjectDetails";
import NewProject from "./modals/NewProject";

import { ProjectsContext } from "./ProjectsContext";
import { useContext } from "react";
import AddTask from "./modals/AddTask";
import AddTasklist from "./modals/AddTasklist";
import TaskDetails from "./modals/TaskDetails";
import ProjectReports from "./components/ProjectReports";
import TaskComments from "./modals/TaskComments";
export default function Projects() {
  const { closeMenu, slideNo, modalNo } = useContext(ProjectsContext);
  return (
    <div
      className="col-12 workingTab animate__animated animate__fadeIn "
      id="Projects"
      onClick={() => closeMenu()}
    >
      {slideNo == 1 ? <ProjectsList /> : null}
      {slideNo == 2 ? <ProjectDetails /> : null}
      {slideNo == 3 ? <ProjectEdit /> : null}
      {slideNo == 4 ? <ProjectReports /> : null}
      {/* Modals */}
      {modalNo == 1 ? <NewProject /> : null}
      {modalNo == 2 ? <AddTask /> : null}
      {modalNo == 3 ? <AddTasklist /> : null}
      {modalNo == 4 ? <TaskDetails /> : null}
      {modalNo == 5 ? <TaskComments /> : null}
    </div>
  );
}
