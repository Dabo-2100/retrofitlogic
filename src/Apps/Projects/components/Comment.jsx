import noUserImg from "@/assets/user.png";
import { useRecoilState } from "recoil";
import { $LoaderIndex, $Server, $Token } from "@/store";
import axios from "axios";
import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { ProjectsContext } from "../ProjectsContext";

export default function Comment(props) {
  const [Server_Url] = useRecoilState($Server);
  const [token] = useRecoilState($Token);
  const [index, setIndex] = useState(false);
  const { reloadComments } = useContext(ProjectsContext);
  const changeComment = () => {
    let newVal = event.target.value;
    axios
      .post(
        `${Server_Url}/php/index.php/api/update`,
        {
          table_name: "task_comments",
          condition: `comment_id = ${props.comment_id}`,
          data: {
            comment_name: newVal,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (!res.data.err) {
          Swal.fire({
            icon: "success",
            text: "Data Updated Succefuly !",
            timer: 1000,
          });
          setIndex(false);
          reloadComments();
        }
      });
  };
  return (
    <div className="col-12 bg-dark text-white rounded d-flex flex-wrap p-3">
      <div className="col-12 d-flex justify-content-between align-items-center">
        <div className="d-flex gap-3 align-items-center">
          {/* <img src={noUserImg} height={30} /> */}
          <p className="mb-0">
            Comment No :{" "}
            <b className="bg-danger py-1 px-3 rounded">{props.comment_id}</b>
          </p>
          {/* <p className="mb-0">{props.username}</p> */}
        </div>
        <p className="bg-success py-1 px-3 rounded text-white">{props.type}</p>
        <p>{props.date}</p>
      </div>
      <hr className="col-12" />
      {index ? (
        <textarea
          className="form-control"
          defaultValue={props.content}
          onBlur={changeComment}
        />
      ) : (
        <h4 className="col-12 d-flex mb-0" onDoubleClick={() => setIndex(true)}>
          {props.content}
        </h4>
      )}
      <hr className="col-12" />
      <div className="col-12 d-flex gap-3 align-items-center">
        <p className=" mb-0">Related to</p>
        <select
          className="form-select"
          style={{ width: "20%" }}
          defaultValue={props.related_comment ? props.related_comment : 0}
          onChange={(event) => {
            let otherID = event.target.value;
            axios
              .post(
                `${Server_Url}/php/index.php/api/update`,
                {
                  table_name: "task_comments",
                  condition: `comment_id = ${props.comment_id}`,
                  data: {
                    related_comment:
                      +event.target.value == 0 ? "Null" : +event.target.value,
                  },
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((res) => {
                axios
                  .post(
                    `${Server_Url}/php/index.php/api/update`,
                    {
                      table_name: "task_comments",
                      condition: `comment_id = ${otherID} AND related_comment IS NULL`,
                      data: {
                        related_comment: +props.comment_id,
                      },
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )
                  .then(() => {
                    if (!res.data.err) {
                      Swal.fire({
                        icon: "success",
                        text: "Comment Relation Updated",
                        timer: 1500,
                      }).then(() => {
                        reloadComments();
                      });
                    }
                  });
                // handleSearch();
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          <option value={0} hidden disabled>
            Not Related
          </option>
          {props.other.map((el, index) => {
            return el.comment_id != props.comment_id ? (
              <option key={index} value={el.comment_id}>
                {el.comment_id}
              </option>
            ) : null;
          })}
        </select>
      </div>
    </div>
  );
}
