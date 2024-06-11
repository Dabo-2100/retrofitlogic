import { useEffect, useState } from "react";
import logo from "../../assets/Logo-Light.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRecoilState } from "recoil";
import { faEye, faEyeSlash, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import "./index.scss";
import { $LoaderIndex, $Server, $Token, $User_Info } from "../../store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
export default function LoginPage() {
  const navigate = useNavigate();
  const [remember_me, setRemember_me] = useState(false);
  const [Server_Url] = useRecoilState($Server);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [tokenCheck, setTokenCheck] = useState();
  const [server] = useRecoilState($Server);
  const [token, setToken] = useRecoilState($Token);
  const [userInfo, setUserInfo] = useRecoilState($User_Info);
  const [showPasswordIndex, setShowPasswordIndex] = useState(0);
  const [, setLoaderIndex] = useRecoilState($LoaderIndex);

  const checkUserToken = () => {
    axios.get(`${server}/php/index.php/api/auth/check`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((result) => {
      let res = result.data;
      if (res.err == false) {
        setUserInfo(res.data);
        setTokenCheck(1);
        navigate('/');
      }
      else {
        setTokenCheck(0);
        localStorage.clear();
        sessionStorage.clear();
      }
    }).catch((err) => {
      setTokenCheck(0);
      localStorage.clear();
      sessionStorage.clear();
    });
  };

  function Login() {
    setLoaderIndex(1);
    let emailValid = false;
    let passwordValid = false;
    if (email) {
      if (email.trim() != "" && email.trim != null) {
        let check = email
          .trim()
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
        if (check == null) {
          alert("invalid Email");
        } else {
          emailValid = true;
        }
      }
    }
    if (password) {
      if (password.trim() != "" && password.trim() != null) {
        passwordValid = true;
      } else {
        alert("Please fill Email");
      }
    } else {
      alert("Please Fill The Email");
    }
    if (passwordValid && emailValid) {
      axios.post(`${Server_Url}/php/index.php/api/auth/login`, {
        user_email: email,
        user_password: password,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((Res) => {
        let res = Res.data;
        if (res.err == false && res.data.user_is_active == true) {
          setUserInfo(res.data);
          setToken(res.data.user_token);
          remember_me == true ? localStorage.setItem("user_token", res.data.user_token) : sessionStorage.setItem("user_token", res.data.user_token);
          Swal.fire({
            icon: "success",
            title: "Successfully Logged in !",
            timer: 1100,
          }).then((res) => {
            navigate('/');
          })
        }
        else if (res.err == false && res.data.user_is_active == false) {
          let user_token = res.data.user_token;
          Swal.fire({
            icon: "info",
            title: "User is Not Active yet!",
            timer: 1200,
          }).then((res) => {
            setToken(user_token);
            sessionStorage.setItem("user_token", user_token);
            navigate('/activate');
          })
        }
        else {
          Swal.fire({
            icon: "error",
            title: "Wrong username or password !",
          })
        }
      }).catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Conntection Error !",
          timer: 1100,
        })
        console.log(err);
      })
    }
    setLoaderIndex(0);
  }

  const togglePassword = () => {
    showPasswordIndex == 1 ? setShowPasswordIndex(0) : setShowPasswordIndex(1);
  }
  useEffect(() => {
    checkUserToken();
  }, []);
  return (
    <>
      {
        tokenCheck == 0 ? (
          <div id="LoginPage" className="col-12">
            <div
              id="Content"
              className="col-12 container animate__animated animate__fadeIn"
            >
              <div className="col-12 col-md-4 leftDiv">
                <img src={logo} />
              </div>
              <div className="col-12 col-md-8 rightDiv">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    Login();
                  }}
                  className="col-12 "
                >
                  <p className="col-12 text-center" style={{ color: "white" }}>
                    <span
                      style={{
                        fontSize: "22px",
                        color: "#438eff",
                        fontWeight: "600",
                      }}
                    >
                      Welcome Back !
                    </span>
                    <br />
                    Sign in to continue to IPACO Retrofit.
                  </p>
                  <label className="col-12">Email Address</label>
                  <div className="inputField col-12">
                    <div className="icon">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <input
                      autoComplete={`false`}
                      className="p-2 form-control"
                      placeholder="Enter Your Email"
                      type="email"
                      required
                      onKeyUp={(e) => {
                        setEmail(e.target.value.toLowerCase());
                      }}
                    />

                  </div>
                  <label className="col-12">Password</label>
                  <div className="inputField col-12">
                    <div className="icon">
                      <FontAwesomeIcon icon={faLock} />
                    </div>
                    <input
                      className="p-2 form-control"
                      placeholder="Enter Your Password"
                      type={showPasswordIndex == 1 ? "text" : "password"}
                      required
                      onKeyUp={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    <FontAwesomeIcon onClick={togglePassword} className="hideIcon" icon={showPasswordIndex == 1 ? faEyeSlash : faEye} />
                  </div>
                  <button className="btn btn-primary col-12">
                    Log in
                  </button>
                  <a href="#" className="col-12 mt-2 text-end">
                    Forgot your password ?
                  </a>
                  <div className="col-12 d-flex align-items-center gap-3">
                    <p style={{ color: "white" }}>Rembmer me</p>
                    <div className="checkbox-wrapper-51">
                      <input id="cbx-51" type="checkbox" onChange={(e) => {
                        setRemember_me(e.target.checked)
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
                </form>
              </div>
            </div>
          </div>
        ) : null
      }
    </>
  );
}
