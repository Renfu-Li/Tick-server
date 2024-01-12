const Router = require("express").Router;
const Focus = require("../models/focusModel");

const focusRouter = Router();

focusRouter.get("/", async (req, res) => {
  const user = req.user;
  const focuses = await Focus.find({ user: user._id });

  return res.status(200).json(tasks);
});

focusRouter.post("/", async (req, res) => {
  const user = req.user;
  const { taskId, start, end, date, focusNote } = req.body;

  const newFocus = new Focus({
    task: taskId,
    user: user._id,
    start,
    end,
    date,
    focusNote,
  });

  await newFocus.save();

  return res.status(200).json(newFocus);
});
