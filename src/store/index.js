import { atom } from "recoil";
import {
  faChartLine,
  faPlugCircleBolt,
  faPuzzlePiece,
  faHelicopter,
  faWarehouse,
  faDatabase,
  faCalendarDays,
  faBook,
  faClipboardUser,
  faEthernet,
} from "@fortawesome/free-solid-svg-icons";

export const $Server = atom({
  key: "$Server",
  // default: "",
  default: "http://localhost/retrofit/public",
});

export const $Token = atom({
  key: "$Token",
  default: sessionStorage.getItem("user_token")
    ? sessionStorage.getItem("user_token")
    : localStorage.getItem("user_token"),
});

export const $LoaderIndex = atom({
  key: "$LoaderIndex",
  default: 0,
});

export const $ActiveHomeTab = atom({
  key: "$ActiveHomeTab",
  default: 2,
});

export const $HomeTabs = atom({
  key: "$HomeTabs",
  default: [
    {
      id: 1,
      name: "Warehouse",
      icon: faWarehouse,
    },
    {
      id: 2,
      name: "Avionics",
      icon: faEthernet,
    },
    {
      id: 3,
      name: "Aircraft Forms",
      icon: faBook,
    },
    {
      id: 4,
      name: "Retrofit Data",
      icon: faDatabase,
    },
    {
      id: 5,
      name: "Projects",
      icon: faCalendarDays,
    },
    {
      id: 6,
      name: "User Authority",
      icon: faChartLine,
    },
  ],
});

export const $MainHeaderH = atom({
  key: "$MainHeaderH",
  default: 0,
});

export const $ActiveModal = atom({
  key: "$ActiveModal",
  default: 0,
});

export const $ActiveForm = atom({
  key: "$ActiveForm",
  default: 0,
});

export const $FormData = atom({
  key: "$FormData",
  default: {
    formInfo: {
      sheet_no: null,
      aircraft_sn: "49064",
      af_hrs: "616.5",
      aircraft_mk: "KM10",
    },
    formRows: [],
  },
});

export const $Resizer = atom({
  key: "$Resizer",
  default: {
    index: 0,
    element: null,
  },
});

export const $folderActionMenuIndex = atom({
  key: "$folderActionMenuIndex",
  default: 0,
});

export const $activeRoute = atom({
  key: "$activeRoute",
  default: 0,
});

export const $formRoutes = atom({
  key: "$formRoutes",
  default: ["Home", "Aircrafts"],
});

export const $User_Authority_Acrive_Modal = atom({
  key: "$User_Authority_Acrive_Modal",
  default: 0,
  // 0 for not active
  // 1 for modal
  // 2 for modal
});

export const $ModalData = atom({
  key: "$ModalData",
  default: {
    sb_id: 0,
    aircraft_id: 0,
    authority_for_id: 0,
  },
});

export const $Retrofit_Data_Active_Tab = atom({
  key: "$Retrofit_Data_Active_Tab",
  default: 0,
});

export const $User_Info = atom({
  key: "$User_Info",
  default: {},
});

export const $openedAircraft_id = atom({
  key: "$openedAircraft_id",
  default: 0,
});

export const $openedForm = atom({
  key: "$openedForm",
  default: {
    form_id: 1,
    form_type: 1,
  },
});
