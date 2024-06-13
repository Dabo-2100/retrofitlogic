async function submitTasks(tasks, tasklist_id) {
  for (let index = 0; index < tasks.length; index++) {
    let order = index + 1;
    let task = tasks[index];
    let taskObj = {
      task_name: task["sb_task_name"],
      task_duration: task["expected_duration_in_hrs"],
      task_desc: task["task_type_name"],
      tasklist_id: tasklist_id,
      task_order: order,
      task_status_id: 1,
    };

    try {
      let response = await axios.post(
        `${Server_Url}/php/index.php/api/insert`,
        {
          table_name: "project_tasks",
          Fields: Object.keys(taskObj),
          Values: Object.values(taskObj),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data.id);
    } catch (error) {
      console.error(`Error submitting task ${order}:`, error);
    }
  }
}

// axios
// .get(`${Server_Url}/php/index.php/api/sb_tasks`, {
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// })
// .then((res) => {
//   let tasks = res.data.data;
//   let groupedTasks = tasks.reduce((acc, task) => {
//     // Extract key properties
//     let sb_name = task.sb_name;
//     let sb_part_name = task.sb_part_name;
//     let department_key =
//       task.department_id == 3 ? "Avionics" : "Structure";

//     // Initialize sb_name level if it doesn't exist
//     if (!acc[sb_name]) {
//       acc[sb_name] = {};
//     }

//     // Initialize sb_part_name level if it doesn't exist
//     if (!acc[sb_name][sb_part_name]) {
//       acc[sb_name][sb_part_name] = {};
//     }

//     // Initialize department level if it doesn't exist
//     if (!acc[sb_name][sb_part_name][department_key]) {
//       acc[sb_name][sb_part_name][department_key] = [];
//     }

//     // Add the task to the corresponding department
//     acc[sb_name][sb_part_name][department_key].push(task);

//     return acc;
//   }, {});

//   for (const sb_no in groupedTasks) {
//     for (const sb_part in groupedTasks[sb_no]) {
//       for (const dep in groupedTasks[sb_no][sb_part]) {
//         if (
//           !sb_no.includes("AAA") &&
//           !sb_no.includes("BBB") &&
//           sb_no.includes("189-293")
//         ) {
//           let tasks = groupedTasks[sb_no][sb_part][dep];

//           let tasklistObj = {
//             tasklist_name: `${sb_part} [ ${dep} ]`,
//             is_template: true,
//             tasklist_status_id: 1,
//           };

//           // axios
//           //   .post(
//           //     `${Server_Url}/php/index.php/api/insert`,
//           //     {
//           //       table_name: "project_tasklists",
//           //       Fields: Object.keys(tasklistObj),
//           //       Values: Object.values(tasklistObj),
//           //     },
//           //     {
//           //       headers: {
//           //         Authorization: `Bearer ${token}`,
//           //       },
//           //     }
//           //   )
//           //   .then((res) => {
//           //     let tasklist_id = res.data.data.id;
//           //     submitTasks(tasks, tasklist_id);
//           //   });
//         }
//       }
//     }
//   }
// })
// .catch((err) => {
//   console.log(err);
// });
