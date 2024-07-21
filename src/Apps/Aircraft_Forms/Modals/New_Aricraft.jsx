import { $ActiveModal } from "@/store";
import { useRecoilState } from "recoil";

export default function New_Aricraft() {
  const [, setActiveModal] = useRecoilState($ActiveModal);
  return (
    <div
      className="col-12 Modal"
      onClick={() => {
        setActiveModal(0);
      }}
    >
      <div
        className="content col-12 col-md-8"
        onClick={(event) => event.stopPropagation()}
      >
        <h1 className="text-center">Hello There</h1>
      </div>
    </div>
  );
}
