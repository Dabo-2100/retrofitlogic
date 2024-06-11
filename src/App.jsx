import { Route, Routes, BrowserRouter, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Loader from "./components/Loader";
import { useRecoilState } from "recoil";
import { $LoaderIndex } from "./store";
import { Api } from "./pages/Api";
import ActivatePage from "./pages/ActivePage";
export default function App() {
  const [loaderIndex] = useRecoilState($LoaderIndex);
  // setLoaderIndex(3);
  return (
    <div className="col-12 App">
      {loaderIndex == 1 ? <Loader /> : null}
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="activate" element={<ActivatePage />} />
            <Route path="api" element={<Api />} />
            <Route path="*" element={"Page 404"} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
