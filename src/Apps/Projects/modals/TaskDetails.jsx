import { useContext } from "react";
import { ProjectsContext } from "../ProjectsContext";

export default function TaskDetails() {
  const { closeModal, task_id } = useContext(ProjectsContext);
  return (
    <div className="col-12 Modal">
      <div className="col-6 Content"></div>
    </div>
  );
}
