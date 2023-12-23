// when adding or deleting tasks, also update the task ref (_id) within User and List
// otherwise, there shouldn't be need to update User and List

const Router = require("express").Router;

const User = require("../models/userModel");
const Task = require("../models/taskModel");
const taskRouter = Router();

taskRouter.get("/", async (req, res) => {
  const user = req.user;
  const tasks = await Task.find({ user: user.id });

  return res.status(200).json(tasks);
});

taskRouter.post("/", async (req, res) => {
  const user = req.user;
  const { taskName, dueDate, listName, completed, taskNote, listId } = req.body;

  const newTask = new Task({
    taskName,
    dueDate,
    listName,
    completed,
    taskNote,
    user: user._id,
  });
  await newTask.save();

  const tasks = user.lists.id(listId).tasks;
  tasks.push(newTask._id);
  await user.save();

  return res.status(200).json(newTask);
});

taskRouter.put("/:id", async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  const { taskName, dueDate, listName, completed, taskNote } = req.body;
  const newTask = {
    taskName,
    dueDate,
    listName,
    completed,
    taskNote,
    user: user._id,
  };

  const updatedTask = await Task.findByIdAndUpdate(id, newTask, { new: true });

  // same _id for updated task. no need to update User
  return res.status(200).json(updatedTask);
});

taskRouter.delete("/:id", async (req, res) => {
  const taskId = req.params.id;
  const user = req.user;
  const { listId } = req.body;

  const deletedTask = await Task.findByIdAndDelete(taskId);

  // delete the task from the user
  const list = user.lists.id(listId);
  list.tasks.pull(taskId);
  await user.save();

  return res.status(200).json(list.tasks);
});

module.exports = taskRouter;
