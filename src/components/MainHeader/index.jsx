import UpperBar from "./UpperBar";
import LowerBar from "./LowerBar";
import { useRecoilState } from "recoil";
import { $MainHeaderH } from "../../store";
import { useEffect } from "react";
export default function MainHeader() {
  const [offsetH, setOffsetH] = useRecoilState($MainHeaderH);
  useEffect(() => {
    if (window.location.pathname != "/login") {
      setOffsetH(document.querySelector("#MainHeader").offsetHeight);
      window.addEventListener("resize", () => {
        setOffsetH(document.querySelector("#MainHeader").offsetHeight);
      });
    }
  }, []);
  return (
    <div
      id="MainHeader"
      className="col-12 d-flex flex-row flex-wrap justify-content-start align-items-start"
    >
      {/* <UpperBar /> */}
      <LowerBar />
    </div>
  );
}
