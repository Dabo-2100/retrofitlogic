import { useEffect, useRef, useState } from "react";
import folderIcon from "@/assets/folder.png";
import newFolderIcon from "@/assets/newFolder.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRecoilState } from "recoil";
import { $activeRoute, $formRoutes, $openedAircraft_id } from "@/store";
import BlankFormCreator from "./BlankFormCreator";

export default function HomeRoute() {
    const [viewType] = useState(1);
    const [clickX, setClickX] = useState(0);
    const [clickY, setClickY] = useState(0);
    const [actionMenuIndex, setActionMenuIndex] = useState(0);
    const [aircrafts] = useState(["49064", "49065", "49073"])
    const [activeRoute, setActiveRoute] = useRecoilState($activeRoute);
    const [formRoutes, setFormRoutes] = useRecoilState($formRoutes);
    const [, setAircraft_id] = useRecoilState($openedAircraft_id);

    const handelRightClick = () => {
        event.preventDefault();
        const x = event.clientX;
        const y = event.clientY;
        setActionMenuIndex(1);
        setClickX(x);
        setClickY(y);
    }
    const openFolder = (folder_no, id) => {
        setAircraft_id(id);
        setActiveRoute(2);
        let oldRoutes = [...formRoutes];
        oldRoutes.length == 3 ? oldRoutes.pop() : null;
        oldRoutes.push(folder_no);
        setFormRoutes(oldRoutes);
    }

    useEffect(() => {
    }, [])
    return (
        <div className="col-12 container" id="HomeRoute" onClick={() => { setActionMenuIndex(0) }}>
            <div className="col-12 section my-3" id="aircrafts">
                <div className="col-12 mb-3 d-flex align-items-center justify-content-between">
                    <h1>Aircrafts</h1>
                    <div className="actions d-flex align-items-center gap-3" style={{ position: 'relative' }}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} style={{ position: 'absolute', left: '8px' }} />
                        <input type="search" placeholder="Search aircrafts" />
                        <img className="newFolderIcon" src={newFolderIcon} />
                    </div>
                </div>
                <div className="col-12 d-flex gap-3 foldersContainer">
                    {
                        aircrafts.map((aircraft, index) => {
                            return (
                                <div
                                    key={index}
                                    onDoubleClick={() => { openFolder(aircraft, 1) }}
                                    className={`${viewType == 1 ? 'folder' : 'tiles'} animate__animated animate__fadeInUp`}
                                    style={{
                                        animationDuration: "300ms",
                                        animationDelay: `${0 + (index * 150)}ms`
                                    }}
                                    onContextMenu={handelRightClick}
                                >
                                    <img src={folderIcon} alt="Folder icon" />
                                    <p>{aircraft}</p>
                                </div>
                            )
                        })
                    }

                    {
                        actionMenuIndex == 1 ? (
                            <div className="folderActionsMenu p-3 d-flex flex-wrap gap-1" style={{ top: clickY, left: clickX }}>
                                <div className="col-12 d-flex p-2 gap-2 action">
                                    <FontAwesomeIcon icon={faTrash} />
                                    <p className="mb-0">Remove Folder</p>
                                </div>
                                <div className="col-12 d-flex p-2 gap-2 action">
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                    <p className="mb-0">Rename Folder</p>
                                </div>
                            </div>
                        ) : null
                    }

                </div>
                <hr className="col-12" />
            </div>
            {activeRoute == 0 ? <BlankFormCreator /> : null}
        </div>
    )
}