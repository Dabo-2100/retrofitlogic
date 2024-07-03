import { useContext, useEffect, useRef, useState } from "react";
import { ProjectsContext } from "../ProjectsContext";
import { useRecoilState } from "recoil";
import { $LoaderIndex, $Server, $Token, $User_Info } from "@/store";
import axios from "axios";
import Comment from "../components/Comment";

export default function TaskComments() {
  const [, setLoaderIndex] = useRecoilState($LoaderIndex);
  const [Server_Url] = useRecoilState($Server);
  const [token] = useRecoilState($Token);
  const [userInfo] = useRecoilState($User_Info);
  const [reloadIndex, setReloadIndex] = useState(0);
  const { task_id, closeModal, setTask_id, reloadTasklists } =
    useContext(ProjectsContext);
  const [taskComments, setTaskComments] = useState([]);
  const newComment = useRef();

  const getAllComments = async () => {
    setLoaderIndex(1);
    await axios
      .get(`${Server_Url}/php/index.php/api/tasks/${task_id}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoaderIndex(0);
        setTaskComments(res.data.data);
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleNewComment = async () => {
    event.preventDefault();
    if (newComment.current.value && newComment.current.value != "") {
      try {
        let commentObj = {
          comment_name: newComment.current.value,
          author_id: userInfo.user_id,
          task_id: task_id,
        };

        let response = await axios.post(
          `${Server_Url}/php/index.php/api/insert`,
          {
            table_name: "task_comments",
            Fields: Object.keys(commentObj),
            Values: Object.values(commentObj),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        newComment.current.value = "";
        setReloadIndex(reloadIndex + 1);
        reloadTasklists();
      } catch (error) {
        console.error(`Error submitting task ${order}:`, error);
      }
    } else {
      alert("Please Fill Comment");
    }
  };

  useEffect(() => {
    getAllComments();
  }, [reloadIndex]);
  return (
    <div
      className="col-12 Modal"
      onClick={() => {
        closeModal();
        setTask_id(undefined);
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="col-12 d-flex flex-wrap bg-white col-11 col-md-8 p-3 rounded gap-3"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <h4 className="col-12">
          Task Comments ({taskComments ? taskComments.length : "0"})
        </h4>

        {taskComments ? (
          <div className="col-12 d-flex flex-wrap gap-3">
            {taskComments.map((comment, index) => {
              comment.user_name = "Dabo";
              return (
                <Comment
                  username={comment.user_name}
                  content={comment.comment_name}
                  date={comment.created_at}
                />
              );
            })}
          </div>
        ) : null}

        <form
          className="col-12 d-flex gap-3 align-items-center"
          onSubmit={handleNewComment}
        >
          <textarea
            ref={newComment}
            className="form-control"
            placeholder="Enter New Comment"
          ></textarea>
          <button className="btn btn-primary col-3">Add</button>
        </form>
      </div>
    </div>
  );
}
