
import { useNavigate, useParams } from "react-router-dom";
import "./index.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { $LoaderIndex, $Server, $Token } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckToSlot } from "@fortawesome/free-solid-svg-icons";
import authImg from "@/assets/Auth.png";
import Swal from "sweetalert2";
export default function ActivatePage() {
    // const { user_id } = useParams();
    const [vCode, setVCode] = useState();
    const [resendIndex, setResendIndex] = useState(0);
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);

    const handelPress = (event) => {
        let Allowed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        if (Allowed.indexOf(+event.key) == -1 && event.key != "Enter") {
            event.preventDefault();
        }
    }

    const handelVerify = (event) => {
        event.preventDefault();
        axios.post(`${Server_Url}/php/index.php/api/auth/activate`, {
            v_code: vCode,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {
            if (res.data.err == false) {
                Swal.fire({
                    icon: "success",
                    text: "Account Activated Successfuly !",
                    timer: 2500,
                }).then(() => {
                    navigate('/');
                })
            }
            else {
                Swal.fire({
                    icon: "error",
                    text: "Code is wrong",
                    timer: 2500,
                })
            }
        }).catch((res) => {
            Swal.fire({
                icon: "error",
                text: "Code is wrong",
                timer: 2500,
            })
        })
    }

    const resendCode = () => {
        setLoaderIndex(1);
        axios.get(`${Server_Url}/php/index.php/api/auth/resendcode`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {
            if (res.data.err == false) {
                setLoaderIndex(0);
                Swal.fire({
                    icon: "success",
                    text: "Verification Code Sent !",
                    timer: 2000,
                }).then(() => {
                    setResendIndex(1);
                });
            }
            else {
                Swal.fire({
                    icon: "error",
                    text: "Code is wrong",
                    timer: 2500,
                })
            }
        }).catch((res) => {
            Swal.fire({
                icon: "error",
                text: "Connection Error",
                timer: 2500,
            })
        })
    }

    const navigate = useNavigate();
    const [token] = useRecoilState($Token);
    const [Server_Url] = useRecoilState($Server);
    const [userInfo, SetUserInfo] = useState(
        { user_name: null }
    );
    useEffect(() => {
        if (token) {
            axios.get(`${Server_Url}/php/index.php/api/auth/check`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => {
                if (res.data.err == false) {
                    SetUserInfo(res.data.data);
                }
                else {
                    navigate("/");
                }
            }).catch((err) => {
                console.log(err);
            })
        }
        else {
            navigate("/");
        }
    }, []);
    return (
        <div id="ActivatePage" className="col-12 d-flex">
            <div className="col-11 col-md-5 content">
                <img src={authImg} className="authImg" />
                <h1 className="col-12 text-center fs-2">
                    {userInfo.user_name}
                    <br />
                    Please , Activate Your Account </h1>
                <p className="col-12 text-center">we have send you a verficationc code message to your email <br /> <b>{userInfo.user_email}</b></p>
                <form className="col-12 d-flex gap-3 flex-wrap" name="" onSubmit={handelVerify}>
                    <input onKeyPress={handelPress} onKeyUp={(e) => { setVCode(e.target.value) }} maxLength={4} placeholder="Enter Verification Code" className="form-control" />
                    <button className="btn btn-primary col-12 fs-4">Verify</button>
                </form>
                <button disabled={resendIndex == 1 ? true : false} className="btn btn-warning col-12" onClick={resendCode}>Resend code</button>
            </div>
        </div>
    )
}
