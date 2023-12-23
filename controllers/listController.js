const Router = require("express").Router;
const Task = require("../models/taskModel");
const listRouter = Router();

listRouter.get("/", async (req, res) => {
  const lists = req.user.lists;
  return res.status(200).json(lists);
});

listRouter.post("/", async (req, res) => {
  const user = req.user;
  const { listName } = req.body;
  user.lists.push({
    listName,
    tasks: [],
  });

  await user.save();

  return res.status(200).json(user.lists);
});

listRouter.delete("/:listId", async (req, res) => {
  const user = req.user;
  const listId = req.params.listId;
  const { listName } = req.body;
  user.lists.pull(listId);
  await user.save();

  // also delete all the tasks within that list
  await Task.deleteMany({ listName });

  res.status(200).json(user.lists);
});

module.exports = listRouter;
