import "./index.scss";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { $Retrofit_Data_Active_Tab } from "@/store";

// Tabs
import Service_Bulletins from "./Tabs/Service_Bulletins";
import Aircrafts from "./Tabs/Aircrafts";
import SB_Parts from "./Tabs/SB_Parts";
import SB_Tasks from "./Tabs/SB_Tasks";

export default function Retrofit_Data() {
  const [activeTab, setActiveTab] = useRecoilState($Retrofit_Data_Active_Tab);
  const [tabs] = useState([
    "Aircraft Fleet",
    "Work Packages",
    "Project Templates",
    "Specializations",
    "Types",
  ]);
  return (
    <div
      id="Retrofit_Data"
      className="workingTab p-0 animate__animated animate__fadeIn"
    >
      <ul className="nav nav-tabs col-12" id="retrofitTabs">
        {tabs.map((tab, index) => {
          return (
            <li
              className="nav-item"
              key={index}
              onClick={() => setActiveTab(index)}
            >
              <a
                className={`nav-link ${activeTab == index ? "active" : null}`}
                aria-current="page"
                href="#"
              >
                {tab}
              </a>
            </li>
          );
        })}
      </ul>
      {activeTab == 0 ? <Aircrafts /> : null}
      {activeTab == 1 ? <Service_Bulletins /> : null}
      {activeTab == 2 ? <SB_Parts /> : null}
      {activeTab == 3 ? <SB_Tasks /> : null}
    </div>
  );
}
