import { useEffect, useState } from "react"
import { useRecoilState } from "recoil";
import { $ModalData, $Server, $Token, $User_Authority_Acrive_Modal } from "../../store";
import "./index.scss";
import axios from "axios";
import New_user_modal from "./new_user_modal";
import Registered_apps_modal from "./registered_apps_modal";
import Swal from "sweetalert2";
import AddBtn from "../../components/AddBtn";

export default function User_Authority() {
    const [Server_Url] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [allUsers, setAllUsers] = useState([]);
    const [activeModal, setActiveModal] = useRecoilState($User_Authority_Acrive_Modal);
    const [modalData, setModalData] = useRecoilState($ModalData);
    const openUserApps = (user_id) => {
        let data = { ...modalData };
        data.authority_for_id = user_id;
        setModalData(data);
        setActiveModal(2);
    }
    const getAllUsers = () => {
        axios.get(`${Server_Url}/php/index.php/api/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((Res) => {
            let res = Res.data;
            if (res.err == false) {
                setAllUsers(res.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const changeActive = (user_id, oldValue) => {
    }

    const resetPassword = (user_id) => {
        Swal.fire({
            icon: "question",
            title: "Are you sure ?",
            text: "You want to reset user passsword to : 'IPACOuser' ",
            showDenyButton: true,
            denyButtonText: "No",
            confirmButtonText: "Yes , Reset"
        }).then((res) => {
            if (res.isConfirmed) {
                axios.post(`${Server_Url}/php/index.php/api/update`, {
                    table_name: "app_users",
                    data: {
                        user_password: "user"
                    },
                    condition: `user_id = ${user_id}`
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }).then((res) => {

                    Swal.fire({
                        icon: "success",
                        text: "Password reset Successfuly",
                        timer: 1500,
                    })
                }).catch((err) => {
                    console.log(err);
                });

            }
        })
    }

    const openModal = (user_id) => {
        setActiveModal(1)
    }
    useEffect(() => {
        getAllUsers();
    }, [activeModal]);


    return (
        <div className="workingTab p-3 animate__animated animate__fadeIn" id="User_Authority">
            <div className="col-12">
                <AddBtn name="Add User" onClick={openModal} />
                {/* <button type="button" className="button" onClick={() => { setActiveModal(1) }}>
                    <span className="button__text">Add User</span>
                    <span className="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24" fill="none" className="svg"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span>
                </button> */}
            </div>
            <table className="col-12 table table-dark table-bordered" id="usersTable">
                <thead>
                    <tr>
                        <td>-</td>
                        <td>User name</td>
                        <td>User email</td>
                        <td>Registered Apps</td>
                        <td>Is Active</td>
                        <td>Reset password</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        allUsers.map((user, index) => {
                            return (
                                <tr key={user.user_id}>
                                    <td>{index + 1}</td>
                                    <td>{user.user_name}</td>
                                    <td>{user.user_email}</td>
                                    <td>
                                        <a className="appLink" onClick={() => {
                                            openUserApps(user.user_id);
                                        }}>{user.user_apps.length} Apps</a>
                                    </td>
                                    <td>
                                        <div className="toggler">
                                            <input id="toggler-1" name="toggler-1" type="checkbox" checked={true} onChange={() => {
                                                alert('test')
                                            }} />
                                            <label htmlFor="toggler-1">
                                                <svg className="toggler-on" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                                                    <polyline className="path check" points="100.2,40.2 51.5,88.8 29.8,67.5"></polyline>
                                                </svg>
                                                <svg className="toggler-off" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                                                    <line className="path line" x1="34.4" y1="34.4" x2="95.8" y2="95.8"></line>
                                                    <line className="path line" x1="95.8" y1="34.4" x2="34.4" y2="95.8"></line>
                                                </svg>
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => {
                                            resetPassword(user.user_id);
                                        }}>Reset</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            {activeModal == 1 ? <New_user_modal /> : null}
            {activeModal == 2 ? <Registered_apps_modal /> : null}
        </div>
    )
}
