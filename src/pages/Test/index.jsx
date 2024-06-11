import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { $LoaderIndex, $Server } from "../../store";
export default function TestPage() {
  function orderByName(a, b) {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  }
  function orderByName2(a, b) {
    if (a.name > b.name) {
      return 1;
    } else if (a.name < b.name) {
      return -1;
    } else {
      return 0;
    }
  }
  const [activeBtns, setActiveBtns] = useState([]);
  const [parts, setParts] = useState([]);
  const [total, setTotal] = useState([
    {
      id: 0,
      name: "",
      des: "",
      sb: "",
      duration: 0,
      Zones: [],
    },
  ]);
  const [allZones, setAllZones] = useState([]);
  const [loaderIndex, setLoaderIndex] = useRecoilState($LoaderIndex);
  const [server] = useRecoilState($Server);

  function getPartDetails(id, name, des, sb) {
    setLoaderIndex(1);
    axios
      .post(server + "php/index.php", {
        api_name: "getPartDetials",
        step: 2,
        SB_Part_id: id,
      })
      .then((res) => {
        let duration = 0;
        let table = [];
        let data = res.data;
        data.forEach((task) => {
          duration += task.duration;
          let area = "";
          if (task.zones.length == 1 && task.Departments.length == 1) {
            area = task.zones[0].name.substring(0, 3);
            area += " - " + task.Departments[0].name;
            if (table.indexOf(area) == -1) {
              table.push(area);
            }
          } else {
            let zones = [];
            let deps = [];
            if (task.Departments.length > 1) {
              task.Departments.forEach((dep) => {
                if (deps.indexOf(dep.name) == -1) {
                  deps.push(dep.name);
                }
              });
            } else {
              if (task.Departments.length > 0) {
                deps.push(task.Departments[0].name);
              }
            }

            if (task.zones.length > 1) {
              task.zones.forEach((zone) => {
                if (zones.indexOf(zone.name) == -1) {
                  zones.push(zone.name);
                }
              });
            } else {
              if (task.zones.length > 0) {
                zones.push(task.zones[0].name);
              }
            }

            deps.forEach((dep) => {
              zones.forEach((zone) => {
                let x = `${zone.substring(0, 3)} - ${dep}`;
                if (table.indexOf(x) == -1) {
                  table.push(x);
                }
              });
            });
          }
        });
        let oldZones = [...allZones];
        table.forEach((zone) => {
          if (oldZones.indexOf(zone) == -1) {
            oldZones.push(zone);
          }
        });
        setAllZones(oldZones);
        let oldTotal = [...total];
        let obj = {
          id: id,
          name: name,
          sb: sb,
          des: des,
          duration: duration,
          Zones: table,
        };
        oldTotal.push(obj);
        setTotal(oldTotal);
        setLoaderIndex(0);
      });
  }

  function getPartsOnAircraft(aircraft_id) {
    setLoaderIndex(1);
    axios
      .post(server + "php/index.php", {
        api_name: "getPartDetials",
        step: 1,
        aircraft_id: aircraft_id,
      })
      .then((res) => {
        setParts(res.data);
        setLoaderIndex(0);
      });
  }

  useEffect(() => {
    let SB_Part_id = 1;
    // getPartsOnAircraft("6133467000000491288");
    // getPartDetails(SB_Part_id);

  }, []);
  return (
    <div
      className="col-12 d-flex flex-wrap justify-content-center"
      id="TestPage"
      style={{ height: "100vh", overflowY: "auto" }}
    >
      <h1
        className="col-12 text-center p-3"
        style={{ color: "white", height: "10vh" }}
      >
        Applicable SB Parts On Aircraft : 49064
      </h1>
      <div
        className="col-12 d-flex flex-wrap gap-2 mb-3 justify-content-center"
        style={{ height: "30vh", overflow: "auto" }}
      >
        {parts.sort(orderByName2).map((part, index) => {
          return (
            <button
              disabled={activeBtns.indexOf(part.id) != -1 ? true : false}
              style={{
                width: "calc(100% / 6)",
              }}
              className={`btn ${activeBtns.indexOf(part.id) != -1
                ? "btn-warning"
                : "btn-primary"
                }`}
              key={index}
              onClick={() => {
                let x = [...activeBtns];
                x.push(part.id);
                setActiveBtns(x);
                getPartDetails(part.id, part.name, part.des, part.sb);
              }}
            >
              {part.name}
            </button>
          );
        })}
      </div>
      <div
        className="col-12 d-flex flex-row flex-wrap "
        style={{
          overflowX: "auto",
          maxWidth: "100vw",
          maxHeight: "calc(60vh - 30px)",
        }}
      >
        <table
          className="col-12 table table-dark table-bordered table-responsive"
          style={{
            textAlign: "center",
            verticalAlign: "middel",
          }}
        >
          <thead>
            <tr
              style={{
                position: "sticky",
                top: -1,
                zIndex: 3,
                backgroundColor: "black",
                border: "1px solid white",
                borderBottom: "1px solid white !important",
              }}
            >
              <th className="col-2">SB Part_Name</th>
              {allZones.sort(orderByName).map((zone, index) => {
                return <th key={index}>{zone}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {total.sort(orderByName2).map((SB_Part, index) => {
              return (
                <tr key={index}>
                  {SB_Part.Zones.length > 0 ? (
                    <td
                      style={{
                        color: "black",
                        position: "sticky",
                        left: 0,
                        zIndex: 2,
                      }}
                    >
                      <p className="bg-info-subtle p-1 mb-1">{SB_Part.name}</p>
                      <p className="bg-info-subtle p-1">{SB_Part.sb}</p>
                      <p className="bg-info-subtle p-1">
                        {Math.ceil(SB_Part.duration)} hrs
                      </p>
                    </td>
                  ) : null}
                  {allZones.map((zone, index) => {
                    if (SB_Part.Zones.length > 0) {
                      if (SB_Part.Zones.indexOf(zone) == -1) {
                        return <td key={index}></td>;
                      } else {
                        return (
                          <td key={index} style={{ verticalAlign: "middle" }}>
                            <p className="col-12 bg-secondary">-</p>
                          </td>
                        );
                      }
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
