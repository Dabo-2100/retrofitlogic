import { useContext, useEffect, useState } from "react";
import { ReportContext } from "../ReportContext";
import axios from "axios";
import { useRecoilState } from "recoil";
import { $Server } from "@/store";

export default function PartDetails() {
  const [Server_Url] = useRecoilState($Server);
  const { detailsModal, setDetailsModal } = useContext(ReportContext);
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    let id = detailsModal.part_id;
    axios
      .get(`${Server_Url}/php/index.php/api/partdetails/${id}`)
      .then((res) => {
        console.log(res.data.data);
        setTasks(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="col-12 Modal" onClick={() => setDetailsModal(false)}>
      <div
        className="col-10 col-md-8 d-flex"
        style={{ maxHeight: "80vh", overflow: "auto" }}
        onClick={(event) => event.stopPropagation()}
      >
        <table className="table table-dark">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Task Status</th>
              <th>Task Comments</th>
            </tr>
          </thead>
          <tbody>
            {tasks
              ? tasks.map((task, index) => {
                  return (
                    <tr key={index}>
                      <th>{task.task_name}</th>
                      <td>{task.task_status_name}</td>
                      <td>
                        {task.comments.map((comment, index) => {
                          console.log(comment);
                          return <p key={index}>{comment.comment_name}</p>;
                        })}
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
