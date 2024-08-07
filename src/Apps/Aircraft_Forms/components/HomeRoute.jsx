import { useContext, useEffect, useRef, useState } from "react";
import folderIcon from "@/assets/folder.png";
import newFolderIcon from "@/assets/newFolder.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
// import { useRecoilState } from "recoil";
// import { $ActiveModal } from "@/store";
// import { $activeRoute, $formRoutes, $openedAircraft_id } from "@/store";
import BlankFormCreator from "./BlankFormCreator";
import { db } from "@/Firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { FormContext } from "../FormContext";

export default function HomeRoute() {
  const [viewType] = useState(1);
  const [clickX, setClickX] = useState(0);
  const [clickY, setClickY] = useState(0);
  const [actionMenuIndex, setActionMenuIndex] = useState(0);
  const [aircrafts, setAircrafts] = useState([]);
  const {
    activeRoute,
    setActiveRoute,
    routes: formRoutes,
    setRoutes: setFormRoutes,
    setActiveAircraft: setAircraft_id,
    setActiveModal,
    setAircraftData,
  } = useContext(FormContext);

  const handelRightClick = () => {
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;
    setActionMenuIndex(1);
    setClickX(x);
    setClickY(y);
  };

  const openFolder = async (id) => {
    const docRef = doc(db, "Aircrafts", `${id}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setAircraftData(docSnap.data());
    } else {
      setAircraftData({});
    }
    setAircraft_id(id);
    setActiveRoute(2);
    let oldRoutes = [...formRoutes];
    oldRoutes.length == 3 ? oldRoutes.pop() : null;
    oldRoutes.push(id);
    setFormRoutes(oldRoutes);
  };

  const getAircrafts = async () => {
    const querySnapshot = await getDocs(collection(db, "Aircrafts"));
    let final = [];
    querySnapshot.forEach((doc) => {
      final.push(doc.id);
    });
    setAircrafts(final);
  };

  useEffect(() => {
    getAircrafts();
  }, []);
  return (
    <div
      className="col-12 container"
      id="HomeRoute"
      onClick={() => {
        setActionMenuIndex(0);
      }}
    >
      <div className="col-12 section my-3" id="aircrafts">
        <div className="col-12 mb-3 d-flex align-items-center justify-content-between">
          <h1>Aircrafts</h1>
          <div
            className="actions d-flex align-items-center gap-3"
            style={{ position: "relative" }}
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{ position: "absolute", left: "8px" }}
            />
            <input type="search" placeholder="Search aircrafts" />
            <img
              className="newFolderIcon"
              src={newFolderIcon}
              onClick={() => {
                // alert('test');
                setActiveModal(1001);
              }}
            />
          </div>
        </div>
        <div className="col-12 d-flex gap-3 foldersContainer">
          {aircrafts.map((aircraft, index) => {
            return (
              <div
                key={index}
                onDoubleClick={() => {
                  openFolder(aircraft);
                }}
                className={`${
                  viewType == 1 ? "folder" : "tiles"
                } animate__animated animate__fadeInUp`}
                style={{
                  animationDuration: "300ms",
                  animationDelay: `${0 + index * 150}ms`,
                }}
                onContextMenu={handelRightClick}
              >
                <img src={folderIcon} alt="Folder icon" />
                <p>{aircraft}</p>
              </div>
            );
          })}

          {actionMenuIndex == 1 ? (
            <div
              className="folderActionsMenu p-3 d-flex flex-wrap gap-1"
              style={{ top: clickY, left: clickX }}
            >
              <div className="col-12 d-flex p-2 gap-2 action">
                <FontAwesomeIcon icon={faTrash} />
                <p className="mb-0">Remove Folder</p>
              </div>
              <div className="col-12 d-flex p-2 gap-2 action">
                <FontAwesomeIcon icon={faPenToSquare} />
                <p className="mb-0">Rename Folder</p>
              </div>
            </div>
          ) : null}
        </div>
        <hr className="col-12" />
      </div>

      {activeRoute == 0 ? <BlankFormCreator /> : null}
    </div>
  );
}

// {
//   aircraft_type: "AW-149",
//   mk_no: 12,
//   is_active: true,
//   sheet_no: "0001",
// }

// {
//   work_required: "Request",
//   work_done: "Response",
//   supervisor_name: "Dabo",
//   originator_name: "Ali",
//   has_1002: true,
//   created_by: "AW-149",
//   control_date: "2024-07-01 T08:00",
// }

// {
//   start_time: "2024-07-05 T08:00",
//   work_required: "Replace Database",
//   reason: "Speed",
//   work_done: "Database Replaced",
//   old_item: {
//     desc: "PHP db",
//     part_no: "Dabo1002",
//     serial_no: "Dabokkd",
//   },
//   new_item: {
//     desc: "Firebase db",
//     part_no: "Dabo2009",
//     serial_no: "DaboLLks",
//   },
//   inspector_name: "Dabo",
//   insection_date: "2024-07-10 T08:00",
//   comments: "Request Done Fully With Respect",
// }
