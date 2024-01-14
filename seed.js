const data = require("./data.json");

const listNames = ["general", "development", "health", "social"];
const allMonths = ["2023-12", "2024-1"];

const randomNum = (min, max) => {
  const inclusive = Math.floor(Math.random() * (max - min + 1)) + min;
  const exclusive = Math.floor(Math.random() * (max - min)) + min;

  return { inclusive, exclusive };
};

const generateDate = () => {
  const monthIndex = randomNum(0, allMonths.length).exclusive;
  const day = randomNum(1, 28).inclusive;
  const date = allMonths[monthIndex] + "-" + day.toString();

  return date;
};

const generateStatus = () => {
  const num = randomNum(1, 10).inclusive;

  return num <= 2 ? true : false;
};

// const generateList = () => {
//   const listIndex = randomNum(0, listNames.length).exclusive;
//   const listName = listNames[listIndex];

//   return listName;
// };

const generateStartEnd = () => {
  const minuteInMs = 60 * 1000;
  const DURATION = {
    min: 5 * minuteInMs,
    max: 120 * minuteInMs,
  };

  const hour = randomNum(8, 20).inclusive;
  const minute = randomNum(0, 59).inclusive;

  const start = new Date(generateDate());
  start.setHours(hour, minute, 0, 0);
  const end = new Date(
    start.getTime() + randomNum(DURATION.min, DURATION.max).inclusive
  );

  return { start, end };
};

const tasks = data.tasks.map((task) => {
  return {
    ...task,
    dueDate: generateDate(),
    completed: generateStatus(),
    removed: generateStatus(),
  };
});

const lists = listNames.map((listName) => {
  const count = tasks.reduce((total, task) => {
    return task.listName === listName && !task.completed && !task.removed
      ? ++total
      : total;
  }, 0);

  return {
    listName,
    count,
  };
});

const focusNum = 100;
let focuses = [];
for (let i = 0; i < focusNum; i++) {
  const focus = generateStartEnd();

  focuses.push({
    start: focus.start,
    end: focus.end,
    focusNote: "",
  });
}

console.log(tasks);

module.exports = { tasks, lists, focuses, randomNum, generateStartEnd };
