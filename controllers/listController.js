const Router = require("express").Router;
const Task = require("../models/taskModel");
const List = require("../models/listModel");
const listRouter = Router();

listRouter.get("/", async (req, res) => {
  const lists = req.user.lists;
  return res.status(200).json(lists);
});

listRouter.get("/:id", async (req, res) => {
  const listId = req.params.id;
  const lists = req.user.lists;
  const foundList = lists.find((list) => list.id === listId);

  return res.status(200).json(foundList);
});

listRouter.post("/", async (req, res) => {
  const user = req.user;
  const { listName } = req.body;

  const newList = new List({
    listName,
    count: 0,
  });
  await newList.save();

  user.lists.push(newList._id);
  await user.save();

  return res.status(201).json(newList);
});

listRouter.put("/:id", async (req, res) => {
  const listId = req.params.id;
  const { listName, count } = req.body;

  const updatedList = await List.findByIdAndUpdate(
    listId,
    { listName, count },
    { new: true }
  );

  return res.status(200).json(updatedList);
});

listRouter.delete("/:id", async (req, res) => {
  const user = req.user;
  const listId = req.params.id;
  const listToDelete = List.findById(listId);
  await listToDelete.deleteOne();

  user.lists.pull(listId);
  await user.save();

  // also delete all the tasks within that list
  await Task.deleteMany({ listName: listToDelete.listName });

  res.status(200).json(user.lists);
});

// delete all the lists for testing
listRouter.delete("/", async (req, res) => {
  await List.deleteMany({});

  res.status(204);
});

module.exports = listRouter;
