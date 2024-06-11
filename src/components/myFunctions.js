export function taskWieght(newTaskName) {
  let task = {};
  task.Name = newTaskName;
  task.order = +newTaskName;
  task.major = +newTaskName;
  task.parent = +newTaskName;
  task.level = 1;
  if (task.Name.indexOf(".") != -1) {
    let taskLevel = task.Name.split(".").length;
    let taskSplit = task.Name.split(".");
    task.level = taskLevel;
    let taskSum = 0;
    taskSplit.forEach((element) => {
      taskSum += +element;
    });
    task.major = +task.Name.split(".")[0];
    if (taskLevel == 2) {
      task.parent = task.Name;
    } else {
      task.parent = task.Name.split(".", taskLevel - 1).join(".");
    }
    let taskParentSlpit = task.parent.split(".");
    let parentSum = 0;
    taskParentSlpit.forEach((element) => {
      parentSum += +element;
    });
    task.order = parentSum * 500 + (taskLevel - 1) * 10 + taskSum;
  }
  let tasksToChange = [];
  if (task.level == 1) {
    tasksToChange = SB_Tasks.filter((t) => {
      return t.major >= task.major;
    });
    tasksToChange.forEach((oldTask) => {
      if (oldTask.Name.indexOf(".") == -1) {
        oldTask.Name++;
      } else {
        let taskSplit = oldTask.Name.split(".");
        taskSplit[0] = +taskSplit[0] + 1;
        oldTask.Name = taskSplit.join(".");
      }
      let obj = {
        id: oldTask.id,
        name: oldTask.Name,
      };
      final.push(obj);
      // oldTask.Name.split("0") =  task.major;
    });
  } else {
    tasksToChange = SB_Tasks.filter((t) => {
      let parentSplit = t.parent.split(".");
      let parentValue = 0;
      parentSplit.forEach((element) => {
        parentValue = parentValue + element * 5;
      });
      let taskSplit = task.Name.split(".");
      let taskValue = 0;
      taskSplit.forEach((element) => {
        taskValue = taskValue + element * 5;
      });
      let tSplit = t.Name.split(".");
      let tValue = 0;

      tSplit.forEach((elemnt) => {
        tValue = tValue + elemnt * 5;
      });

      if (task.level == 2) {
        return parentValue >= taskValue && t.major == task.major;
      } else if (task.level == 3) {
        return t.parent == task.parent && tValue >= taskValue;
      }
    });
    tasksToChange.forEach((oldTask) => {
      let taskSplit = oldTask.Name.split(".");
      let digit = oldTask.Name.split(".")[oldTask.level - 1];
      taskSplit[oldTask.level - 1] = +digit + 1;
      oldTask.Name = taskSplit.join(".");
      let obj = {
        id: oldTask.id,
        name: oldTask.Name,
      };
      final.push(obj);
    });
  }
}