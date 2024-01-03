const testingRouter = require("express").Router();
const User = require("../models/userModel");
const List = require("../models/listModel");
const Task = require("../models/taskModel");

testingRouter.post("/reset", async (req, res) => {
  await User.deleteMany({});
  await List.deleteMany({});
  await Task.deleteMany({});

  res.status(204).end();
});

module.exports = testingRouter;
