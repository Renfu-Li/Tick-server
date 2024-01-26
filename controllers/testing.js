const bcrypt = require("bcrypt");
const testingRouter = require("express").Router();
const User = require("../models/userModel");
const List = require("../models/listModel");
const Task = require("../models/taskModel");
const Focus = require("../models/focusModel");
const { tasks, lists, focuses, randomNum } = require("../seed");

const clearDB = async () => {
  await User.deleteMany({});
  await List.deleteMany({});
  await Task.deleteMany({});
};

const seedDB = async () => {
  // create a user
  const passwordHash = await bcrypt.hash("pass", 10);
  const user = new User({
    username: "public_user",
    passwordHash,
  });

  await user.save();
  const userInDB = await User.findOne({ username: "public_user" });

  // create lists
  const createLists = async (lists) => {
    for (const list of lists) {
      const newList = new List(list);
      await newList.save();

      userInDB.lists.push(newList._id);
      await userInDB.save();
    }
  };

  await createLists(lists);

  // create tasks
  const createTasks = async (tasks) => {
    for (const task of tasks) {
      const newTask = new Task({
        ...task,
        user: userInDB._id,
      });

      await newTask.save();
    }
  };

  await createTasks(tasks);

  // create focuses
  const allTasks = await Task.find({ user: userInDB._id });

  const createFocuses = async (focuses) => {
    for (const focus of focuses) {
      const taskIndex = randomNum(0, allTasks.length).exclusive;

      const newFocus = new Focus({
        ...focus,
        task: allTasks[taskIndex]._id,
        user: userInDB._id,
      });

      await newFocus.save();
    }
  };

  await createFocuses(focuses);
};

// APIs

testingRouter.post("/clear", async (req, res) => {
  await clearDB();

  res.status(204).send("Cleared successfully");
});

testingRouter.post("/seed", async (req, res) => {
  await seedDB();

  res.status(204).send("Seeded successfully");
});

testingRouter.post("/reset", async (req, res) => {
  await clearDB();
  await seedDB();

  res.status(204).send("Reset successfully");
});

module.exports = testingRouter;
