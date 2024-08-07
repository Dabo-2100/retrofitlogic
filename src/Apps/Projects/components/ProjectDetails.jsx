import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useProjectStatus } from "./customHooks";
import { ProjectsContext } from "../ProjectsContext";
import { useRecoilState } from "recoil";
import { $Token, $Server } from "@/store";
import Tasklist from "./Tasklist";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faHouse,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { $LoaderIndex } from "@/store";

export default function ProjectDetails() {
  const [, setLoaderIndex] = useRecoilState($LoaderIndex);
  const [Server_Url] = useRecoilState($Server);
  const [token] = useRecoilState($Token);
  const {
    setTaskListContext,
    project_id,
    reloadTasklists,
    reloadTasklistsIndex,
    openSlide,
    reloadProjects,
    openModal,
    project_name,
    setFilter,
    filter,
  } = useContext(ProjectsContext);

  const [allTasklists, setAllTasklists] = useState([]);
  const [view, setView] = useState([]);

  const getProjectTaskLists = () => {
    setLoaderIndex(1);
    if (filter.data.dep == 0) {
      axios
        .get(
          `${Server_Url}/php/index.php/api/projects/${project_id}/tasklists`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (!res.data.err) {
            setAllTasklists(res.data.data);
            setView(res.data.data);
          } else {
            setAllTasklists([]);
            setView([]);
          }
          setLoaderIndex(0);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .post(
          `${Server_Url}/php/index.php/api/projects/${project_id}/tasklists`,
          {
            contains: filter.data.dep,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (!res.data.err) {
            setAllTasklists(res.data.data);
            setView(res.data.data);
          } else {
            setAllTasklists([]);
            setView([]);
          }
          setLoaderIndex(0);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const allStatus = useProjectStatus();

  const pageView = useRef();

  const handlePrint = () => {
    // console.log(resTable.current.outerHTML);
    // var newWin = window.open('', 'Print-Window');
    var newWin = window.open("");
    newWin.document.open();
    newWin.document.write("<html><head><title>Print Report</title>");
    newWin.document.write(`
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            <style>
            table,tr,td,th{
              background-color : white !important;
              color : black !important;
              text-align : center;
              vertical-align : middle;
            }
              
            *[print='false']{
              display :none;
            }

            </style>
        `);
    newWin.document.write(
      '</head><body class="p-5" onload="window.print();window.close()">'
    );
    newWin.document.write(pageView.current.outerHTML);
    newWin.document.write("</body></html>");
    // newWin.document.close();
  };

  // const filterTaskLists = () => {};

  useEffect(() => {
    if (reloadTasklistsIndex == 0) {
      setFilter({
        index: false,
        data: {
          dep: 0,
          status: 0,
          tasklist: 0,
        },
      });
    }
    setView([]);
    getProjectTaskLists();
  }, [reloadTasklistsIndex]);

  return (
    <div
      className="col-12"
      onClick={() => {
        setTaskListContext({ index: 0, x: 0, y: 0 });
      }}
    >
      <div className="col-12 d-flex flex-wrap gap-1 p-3">
        <div className="col-12 pb-3 d-flex justify-content-between align-items-between">
          <div
            className="d-flex gap-3 align-items-center"
            style={{ color: "white" }}
          >
            <FontAwesomeIcon
              icon={faHouse}
              onClick={() => {
                openSlide(1);
                reloadProjects();
              }}
            />
            <FontAwesomeIcon icon={faAngleRight} />
            <p className="m-0">{project_name}</p>
          </div>
          <div className="d-flex text-white align-items-center gap-3">
            <FontAwesomeIcon
              icon={faPrint}
              className="fs-4"
              onClick={handlePrint}
            />
            <button className="btn btn-success" onClick={() => openModal(3)}>
              New SB Part
            </button>
          </div>
        </div>
        <div className="col-12 d-flex gap-3 text-white align-items-end mb-3">
          <div className="d-flex flex-wrap gap-2">
            <label>Departement</label>
            <select
              className="form-select"
              onChange={(event) => {
                let fil = filter;
                fil.data.dep = event.target.value;
                setFilter(fil);
                reloadTasklists();
              }}
            >
              <option value="0">All Departements</option>
              <option value="Avionics">Avionics</option>
              <option value="Structure">Structure</option>
            </select>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <label>Task Status</label>
            <select
              className="form-select"
              onChange={(event) => {
                let fil = filter;
                fil.data.status = +event.target.value;
                setFilter(fil);
                reloadTasklists();
              }}
            >
              <option value="0">All Tasks</option>
              {allStatus.map((el) => {
                return (
                  <option value={el.status_id} key={el.status_id}>
                    {el.status_name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <label>Service Bulletins</label>
            <input
              className="form-control"
              onChange={(event) => {
                let val = event.target.value.toLowerCase();
                if (val && val != "" && val != null) {
                  let res = allTasklists.filter((el) => {
                    return el.tasklist_name.toLowerCase().includes(val);
                  });
                  setView(res);
                } else {
                  setView(allTasklists);
                }
              }}
            />
          </div>
        </div>
        <div className="col-12 d-flex flex-wrap" ref={pageView}>
          <table className="table col-12 table-dark table-bordered mb-0">
            <thead>
              <tr>
                <th style={{ width: "4%" }} print="false">
                  -
                </th>
                <th style={{ width: "26%" }}>SB Part Name / Task name</th>
                <th style={{ width: "20%" }} print="false">
                  % Progress
                </th>
                <th style={{ width: "15%" }} print="false">
                  Start date
                </th>
                <th style={{ width: "15%" }} print="false">
                  Actual Duration
                </th>
                <th style={{ width: "10%" }} print="false">
                  Estimated Duration
                </th>
                <th style={{ width: "10%" }}>Status</th>
              </tr>
            </thead>
          </table>
          {view.map((tasklist, index) => {
            // console.log(tasklist.tasklist_id);
            return (
              <div
                key={tasklist.tasklist_id}
                className="col-12 tasklistRow d-flex flex-wrap gap-0 animate__animated animate__fadeIn"
                style={{
                  animationDuration: "200ms",
                  animationDelay: `${150 * (1 + index)}ms`,
                }}
              >
                <Tasklist
                  id={tasklist.tasklist_id}
                  name={tasklist.tasklist_name}
                  progress={tasklist.tasklist_progress.toFixed(2)}
                  startDate={tasklist.tasklist_start_date}
                  endDate={tasklist.tasklist_end_date}
                  duration={tasklist.tasklist_duration}
                  status={tasklist.tasklist_status_name}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
