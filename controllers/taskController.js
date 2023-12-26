// when adding or deleting tasks, also update the task ref (_id) within User and List
// otherwise, there shouldn't be need to update User and List

const Router = require("express").Router;

const User = require("../models/userModel");
const Task = require("../models/taskModel");
const List = require("../models/listModel");
const taskRouter = Router();

taskRouter.get("/", async (req, res) => {
  const user = req.user;
  const tasks = await Task.find({ user: user._id });

  return res.status(200).json(tasks);
});

taskRouter.post("/", async (req, res) => {
  const user = req.user;
  const { taskName, dueDate, listName, completed, taskNote } = req.body;

  const newTask = new Task({
    taskName,
    dueDate,
    completed,
    taskNote,
    listName,
    user: user._id,
  });
  await newTask.save();

  const listToUpdate = await List.findOne({ listName });
  listToUpdate.tasks.push(newTask._id);
  await listToUpdate.save();

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
  };

  const updatedTask = await Task.findByIdAndUpdate(id, newTask, { new: true });

  return res.status(200).json(updatedTask);
});

taskRouter.delete("/:id", async (req, res) => {
  const taskId = req.params.id;

  const deletedTask = await Task.findByIdAndDelete(taskId);

  // delete the task from the List collection
  const listToUpdate = await List.findOne({
    listName: deletedTask.listName,
  }).populate("tasks");
  const updatedTasks = listToUpdate.tasks.filter((task) => task.id !== taskId);
  listToUpdate.tasks = updatedTasks;
  await listToUpdate.save();
  return res.status(200).json(deletedTask);
});

module.exports = taskRouter;
