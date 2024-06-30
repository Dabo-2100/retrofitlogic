// ThemeContext.js
import { createContext, useState } from "react";

const ProjectsContext = createContext();

const MenuProvider = ({ children }) => {
  const [menuIndex, setMenuIndex] = useState(false);

  const openMenu = () => {
    setMenuIndex(true);
  };

  const closeMenu = () => {
    setMenuIndex(false);
  };

  const [filter, setFilter] = useState({
    index: false,
    data: {
      dep: 0,
      status: 0,
      tasklist: 0,
    },
  });

  const [project_id, setProject_id] = useState();
  const [project_name, setProject_name] = useState();

  const [task_id, setTask_id] = useState();

  const [list_id, setTasklist_id] = useState();

  const [slideNo, setSlideNo] = useState(1);
  const openSlide = (no) => setSlideNo(no);

  const [modalNo, setModalNo] = useState(0);
  const openModal = (no) => setModalNo(no);
  const closeModal = () => setModalNo(0);

  const [reloadProjectsIndex, setreloadProjectsIndex] = useState(0);
  const reloadProjects = () => setreloadProjectsIndex(reloadProjectsIndex + 1);

  const [reloadTasklistsIndex, setreloadTasklists] = useState(0);
  const reloadTasklists = () => setreloadTasklists(reloadTasklistsIndex + 1);

  const [editProgress, setEditProgress] = useState({
    index: false,
    task_id: null,
  });

  const openProgressEditor = (task_id) => {
    let obj = {
      index: true,
      task_id: task_id,
    };
    setEditProgress(obj);
  };

  const closeProgressEditor = () => {
    setEditProgress({
      index: false,
      task_id: null,
    });
  };

  const [taskListContext, setTaskListContext] = useState({
    index: false,
    x: 0,
    y: 0,
  });

  return (
    <ProjectsContext.Provider
      value={{
        taskListContext,
        setTaskListContext,
        menuIndex,
        openMenu,
        closeMenu,
        project_id,
        setProject_id,
        project_name,
        setProject_name,
        slideNo,
        openSlide,
        modalNo,
        openModal,
        closeModal,
        reloadProjectsIndex,
        reloadProjects,
        reloadTasklistsIndex,
        reloadTasklists,
        list_id,
        setTasklist_id,
        editProgress,
        openProgressEditor,
        closeProgressEditor,
        filter,
        setFilter,
        task_id,
        setTask_id,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export { ProjectsContext, MenuProvider };
