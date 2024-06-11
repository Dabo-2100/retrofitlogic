import { useRecoilState } from "recoil";
import { $ActiveModal, $Server, $Token } from "../../../store";
import { useEffect } from "react";
import axios from "axios";

export default function Modal_new_sb() {
    const [token] = useRecoilState($Token);
    const [Server_Url] = useRecoilState($Server);
    const [ActiveModal, setActiveModal] = useRecoilState($ActiveModal);
    return (
        <div className="Modal" id="Modal_new_sb" onClick={() => {
            setActiveModal(0);
        }}>
            <div className="content p-3 animate__animated animate__fadeInDown" onClick={(e) => { e.stopPropagation() }}>
                This is new SB Modal
            </div>
        </div>
    )
}
