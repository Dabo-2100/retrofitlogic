import axios from "axios";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { $Server, $Token } from "@/store";

let status = [];

export const getTodayDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${
    now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1
  }-${now.getDate() < 10 ? `0${now.getDate()}` : now.getDate()}`;
};

export const useMakeDate = (date) => {
  const [res, setRes] = useState();
  useEffect(() => {
    const now = new Date(date);
    let final = `${now.getFullYear()}-${
      now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1
    }-${now.getDate() < 10 ? `0${now.getDate()}` : now.getDate()}`;
    setRes(final);
  }, []);
  return res;
};

export const useProjectStatus = () => {
  const [Server_Url] = useRecoilState($Server);
  const [token] = useRecoilState($Token);
  const [res, setRes] = useState([]);
  useEffect(() => {
    if (status.length == 0) {
      axios
        .get(`${Server_Url}/php/index.php/api/projects/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setRes(res.data.data);
          status = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setRes(status);
    }
  }, []);
  return res;
};

export const useAllTeams = () => {
  const [Server_Url] = useRecoilState($Server);
  const [token] = useRecoilState($Token);
  const [res, setRes] = useState([]);
  useEffect(() => {
    axios
      .get(`${Server_Url}/php/index.php/api/projects/teams`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRes(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return res;
};

export const useProjectTaskLists = (project_id) => {
  const [final, setFinal] = useState([]);
  const [Server_Url] = useRecoilState($Server);
  const [token] = useRecoilState($Token);
  useEffect(() => {
    axios
      .get(`${Server_Url}/php/index.php/api/projects/${project_id}/tasklists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (!res.data.err) {
          const tasklists = res.data.data;
          setFinal(tasklists);
        }
      })
      .catch((err) => {
        setFinal([]);
      });
  }, []);
  return final;
};

export const getDueDate = (startDatetime, durationHours) => {
  // const offsetMinutes = -1 * new Date().getTimezoneOffset();
  let taskDurationMins = durationHours * 60;
  let startDate = new Date(startDatetime);

  let workStartAt = new Date(startDate.setHours(8, 0));
  let workEndAt = new Date(startDate.setHours(16, 0));
  let workDiff = workEndAt - workStartAt;
  let workingMintsPerDay = workDiff / (1000 * 60);
  let remainWorkMins =
    (new Date(workEndAt) - new Date(startDatetime)) / (1000 * 60);

  let dueDate = new Date(startDatetime);
  if (taskDurationMins <= remainWorkMins) {
    let newTime = dueDate.getMinutes() + taskDurationMins;
    dueDate.setMinutes(newTime);
  } else {
    let remainTime = taskDurationMins - remainWorkMins;
    let taskDurationDays = Math.floor(remainTime / workingMintsPerDay);
    let remainMints =
      ((remainTime / workingMintsPerDay) % 1) * workingMintsPerDay;
    if (taskDurationDays == 0) {
      if (dueDate.getDay() + 1 == 5) {
        dueDate.setDate(dueDate.getDate() + 3);
      } else {
        dueDate.setDate(dueDate.getDate() + 1);
      }
    } else {
      for (let index = 0; index <= taskDurationDays; index++) {
        if (dueDate.getDay() + 1 == 5) {
          dueDate.setDate(dueDate.getDate() + 3);
        } else {
          dueDate.setDate(dueDate.getDate() + 1);
        }
      }
    }
    dueDate.setHours(8, 0);
    dueDate.setMinutes(remainMints);
  }
  let now = dueDate;
  let final = `${now.getFullYear()}-${
    now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1
  }-${now.getDate() < 10 ? `0${now.getDate()}` : now.getDate()}T${
    now.getHours() < 10 ? `0${now.getHours()}` : now.getHours()
  }:${now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes()}`;
  return final;
};
