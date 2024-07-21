import { Route, Routes, BrowserRouter, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Loader from "./components/Loader";
import { useRecoilState } from "recoil";
import { $LoaderIndex } from "./store";
import { Api } from "./pages/Api";
import ActivatePage from "./pages/ActivePage";
import ReportsPage from "./pages/ReportsPage";
import { useEffect, useState } from "react";
import ItalyPage from "./pages/ItalyPage";
import { ReportProvider } from "./pages/ReportsPage/ReportContext";
export default function App() {
  const [innerH, setInnerH] = useState(window.innerHeight);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setInnerH(window.innerHeight);
    });
  }, []);
  const [loaderIndex] = useRecoilState($LoaderIndex);
  // setLoaderIndex(3);
  return (
    <div className="col-12 App" style={{ height: innerH }}>
      {loaderIndex == 1 ? <Loader /> : null}
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="activate" element={<ActivatePage />} />
            <Route path="api" element={<Api />} />
            <Route path="kpi/:aircraft_sn" element={<ItalyPage />}></Route>
            <Route
              path="report/:reportNo/:projectID"
              element={
                <ReportProvider>
                  <ReportsPage />
                </ReportProvider>
              }
            />
            <Route path="*" element={"Page 404"} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
