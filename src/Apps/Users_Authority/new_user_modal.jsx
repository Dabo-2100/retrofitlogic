import { useRecoilState } from "recoil"
import { $Server, $Token, $User_Authority_Acrive_Modal } from "../../store"
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
export default function New_user_modal() {
    const [activeModal, setActiveModal] = useRecoilState($User_Authority_Acrive_Modal);
    const [token] = useRecoilState($Token);
    const [Server_Url] = useRecoilState($Server);
    const [user_email, setUser_email] = useState();
    const [user_name, setUser_name] = useState();
    const [is_super, setIs_super] = useState();
    const add_new_user = (user_email, user_name, is_super) => {
        axios.post(`${Server_Url}/php/index.php/api/users/store`, {
            user_email: user_email,
            user_name: user_name,
            is_super: is_super,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((Res) => {
            let res = Res.data;
            if (res.err == false) {
                Swal.fire({
                    icon: "success",
                    text: "User added successfuly",
                    timer: 1500,
                }).then(() => {
                    setActiveModal(0);
                })
            }
            else {
                Swal.fire({
                    icon: "error",
                    text: "User is already exist",
                    timer: 1500,
                })

            }
        }).catch((err) => {
            console.log(err);
        })
    }
    return (
        <div className="col-12 Modal" onClick={() => {
            setActiveModal();
        }}>
            <div onClick={(e) => {
                e.stopPropagation();
            }} className="content animate__animated animate__fadeInDown p-3">
                <form className="col-12" onSubmit={(e) => {
                    e.preventDefault();
                    add_new_user(user_email, user_name, is_super);
                }}>
                    {/* <p className="col-12 text-start  p-2 mb-2">Add new user</p> */}
                    <input type="email" className="col-12 form-control mb-3" placeholder="Enter user email" onKeyUp={(e) => {
                        setUser_email(e.target.value);
                    }} required />

                    <input className="col-12 form-control mb-3" placeholder="Enter user name" onKeyUp={(e) => {
                        setUser_name(e.target.value);
                    }} required minLength={6} />

                    <div className="col-12 d-flex justify-content-between px-1 mb-3">
                        <p>Is super user ?</p>
                        <div className="checkbox-wrapper-51">
                            <input id="cbx-51" type="checkbox" onChange={(e) => {
                                setIs_super(e.target.checked);
                            }} />
                            <label className="toggle" htmlFor="cbx-51">
                                <span>
                                    <svg viewBox="0 0 10 10" height="10px" width="10px">
                                        <path d="M5,1 L5,1 C2.790861,1 1,2.790861 1,5 L1,5 C1,7.209139 2.790861,9 5,9 L5,9 C7.209139,9 9,7.209139 9,5 L9,5 C9,2.790861 7.209139,1 5,1 L5,9 L5,1 Z"></path>
                                    </svg>
                                </span>
                            </label>
                        </div>
                    </div>
                    <button className="col-12 btn btn-success">Add</button>
                </form>

            </div>
        </div>
    )
}
