import { useRecoilState } from "recoil"
import { $Server, $Token, $User_Authority_Acrive_Modal } from "@/store"
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { $ModalData } from "../../store";

export default function Registered_apps_modal() {
    const [, setActiveModal] = useRecoilState($User_Authority_Acrive_Modal);
    const [token] = useRecoilState($Token);
    const [Server_Url] = useRecoilState($Server);
    const [allApps, setAllAps] = useState([]);
    const [userApps, setUserApps] = useState([]);
    const [modalData] = useRecoilState($ModalData);
    const getUserApps = () => {
        axios.post(`${Server_Url}/php/index.php/api/users/authority`, {
            user_id: modalData.authority_for_id,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {
            if (res.data.err == false) {
                setAllAps(res.data.data.all_apps);
                setUserApps(res.data.data.user_authority);
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Network Connection Error",
                    timer: 2000,
                });
            }
        }).catch((err) => {
            Swal.fire({
                icon: "error",
                title: "Network Connection Error",
                timer: 2000,
            });
        })
    };

    const changeAuth = (event, oldValue, app_id) => {
        let log = userApps.find((userApp) => { return userApp.app_id == +app_id });

        let newValue = event.target.value;
        Swal.fire({
            icon: "question",
            title: "Are you sure you want to update the user role ?",
            showDenyButton: true,
            confirmButtonText: "Yes , Update it",
            denyButtonText: "No,Keep it"
        }).then((res) => {
            if (res.isConfirmed) {
                axios.post(`${Server_Url}/php/index.php/api/update`, {
                    table_name: "app_user_authority",
                    data: {
                        role_id: newValue
                    },
                    condition: `log_id = ${log.log_id}`
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }).then((res) => {
                }).catch(() => {
                    Swal.fire({
                        icon: "error",
                        title: "Connection Error !",
                        timer: 1000,
                    })
                })
                Swal.fire({
                    icon: "success",
                    title: "User role updated successfuly !",
                    timer: 1500
                })
            } else {
                event.target.value = oldValue;
            }
        })

    }
    const getValue = (app_id) => {
        let x = userApps.findIndex((approvedApp) => { return approvedApp.app_id == +app_id });

        if (x == -1) {
            return 0;
        }
        else {
            return userApps[x]['role_id'];
        }
    }
    useEffect(() => {
        getUserApps();
    }, []);
    return (
        <div className="col-12 Modal" onClick={() => {
            setActiveModal(0);
        }}>
            <div onClick={(e) => {
                e.stopPropagation();
            }} className="content animate__animated animate__fadeInDown flex-wrap">
                <p className="col-12 alert alert-primary text-center">
                    User Registered Apps
                </p>
                <table className="table table-dark table-bordered">
                    <thead>
                        <tr>
                            <th>-</th>
                            <th>App Name</th>
                            <th>User Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allApps.map((app, index) => {
                                return (
                                    <tr key={index}>
                                        <th>{index + 1}</th>
                                        <th>{app.app_name}</th>
                                        <th>
                                            {
                                                getValue(app.app_id) != 0 ? (
                                                    <select className="form-select" defaultValue={getValue(app.app_id)} onChange={(e) => { changeAuth(e, getValue(app.app_id), app.app_id) }}>
                                                        <option value={2}>Super</option>
                                                        <option value={2}>Admin</option>
                                                        <option value={3}>User</option>
                                                    </select>
                                                ) : null
                                            }
                                        </th>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div >
    )
}
