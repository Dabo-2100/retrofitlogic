import axios from "axios";
import { useRecoilState } from "recoil";
import { $Server, $Token, $User_Info } from "../../store";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import data_1 from "../../data/res_1.json";
export function Api() {
  const navigate = useNavigate();
  const remember_me = true;
  const [token, setToken] = useRecoilState($Token);
  const [Server_Url] = useRecoilState($Server);
  const [userInfo, setUserInfo] = useRecoilState($User_Info);

  const user_login = (user_email, user_password) => {
    axios
      .post(
        `${Server_Url}/php/index.php/api/auth/login`,
        {
          user_email: user_email,
          user_password: user_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((Res) => {
        let res = Res.data;
        if (res.err == false) {
          setToken(res.data.user_token);
          setUserInfo(res.data);
          remember_me == true
            ? localStorage.setItem("user_token", res.data.user_token)
            : sessionStorage.setItem("user_token", res.data.user_token);
          remember_me == true
            ? localStorage.setItem("user_info", JSON.stringify(res.data))
            : sessionStorage.setItem("user_info", JSON.stringify(res.data));
          Swal.fire({
            icon: "success",
            title: "Successfuly Loged in",
            timer: 1200,
          }).then((res) => {
            navigate("/");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Wrong username or password !",
          });
          // alert("Wrong username or password");
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const get_all_users = () => {
    axios
      .get(`${Server_Url}/php/index.php/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((Res) => {
        let res = Res.data;
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const add_new_user = (user_email, user_name, is_super) => {
    axios
      .post(
        `${Server_Url}/php/index.php/api/users/store`,
        {
          user_email: user_email,
          user_name: user_name,
          is_super: is_super,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((Res) => {
        let res = Res.data;
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const get_data_from_zoho = () => {
    axios
      .post(
        "https://www.zohoapis.com/crm/v2/functions/get_data/actions/execute?auth_type=apikey&zapikey=1003.6f48757796b7b7657ba3026676537e65.ef98a62d5eba8fd19d777611abef025b"
      )
      .then((res) => {})
      .catch((err) => {});
  };

  const insert_data = async (table_name, Fields, Values) => {
    await axios
      .post(
        `${Server_Url}/php/index.php/api/insert`,
        {
          table_name: table_name,
          Fields: Fields,
          Values: Values,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {});
  };

  const get_data = () => {
    axios
      .post(`${Server_Url}/php/zoho_functions.php`, {
        api_name: "getData",
      })
      .then((res) => {
        let total = res.data;
        let start = 1001;
        let end = 2000;
        let table_name = "manpower_zoho";
        let Fields = [
          "department_id",
          "department_name",
          "task_id",
          "task_name",
        ];
        total.forEach((row, index) => {
          if (index >= start && index <= end) {
            let department_id = row["Department_Name.id"];
            let department_name = row["Department_Name.Name"];
            let task_id = row["Parent_Id.id"];
            let task_name = row["Parent_Id.Name"];
            let Values = [department_id, department_name, task_id, task_name];
            insert_data(table_name, Fields, Values);
          }
        });
      });
  };

  return (
    <div className="col-12">
      <h1 className="alert alert-danger">This is api test</h1>
      <button
        className="btn btn-primary"
        onClick={() => {
          // user_login("a_fattah_m@icloud.com", "admin");
          // get_all_users();
          // add_new_user("Ahmed@icloud.com", "Ahmed", false);
          // get_data_from_zoho();
          get_data();
          // insert_data();
        }}
      >
        Fire Api
      </button>

      <button
        className="btn btn-primary"
        onClick={() => {
          // user_login("ali@icloud.com", "IPACOuser");
          // user_login("a_fattah_m@icloud.com", "admin");
        }}
      >
        Login
      </button>
    </div>
  );
}
