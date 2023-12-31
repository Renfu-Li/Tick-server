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
  const { taskName, dueDate, listName, completed, removed, taskNote } =
    req.body;

  const newTask = new Task({
    taskName,
    dueDate,
    completed,
    removed,
    taskNote,
    listName,
    user: user._id,
  });
  await newTask.save();

  const listToUpdate = await List.findOne({ listName });
  listToUpdate.count++;
  await listToUpdate.save();

  return res.status(200).json(newTask);
});

taskRouter.put("/:id", async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  const { taskName, dueDate, listName, completed, removed, taskNote } =
    req.body;
  const newTask = {
    taskName,
    dueDate,
    listName,
    completed,
    removed,
    taskNote,
  };

  const updatedTask = await Task.findByIdAndUpdate(id, newTask, { new: true });

  return res.status(200).json(updatedTask);
});

// really delete a task
taskRouter.delete("/:id", async (req, res) => {
  const taskId = req.params.id;

  const deletedTask = await Task.findByIdAndDelete(taskId);

  // decrease the count from the List collection
  const listToUpdate = await List.findOne({
    listName: deletedTask.listName,
  });

  listToUpdate.count--;
  await listToUpdate.save();
  return res.status(204).json(deletedTask);
});

// really delete all tasks
taskRouter.delete("/", async (req, res) => {
  await Task.deleteMany({});
  await List.deleteMany({});

  return res.status(204).send("All tasks and lists deleted");
});

module.exports = taskRouter;
