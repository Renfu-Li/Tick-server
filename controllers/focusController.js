const Router = require("express").Router;
const Focus = require("../models/focusModel");

const focusRouter = Router();

focusRouter.get("/", async (req, res) => {
  const user = req.user;

  const focuses = await Focus.find({ user: user._id }).populate("task");

  return res.status(200).json(focuses);
});

focusRouter.post("/", async (req, res) => {
  const user = req.user;
  const { taskId, start, end, focusNote } = req.body;

  const newFocus = new Focus({
    task: taskId,
    user: user._id,
    start,
    end,
    focusNote,
  });

  await newFocus.save();

  return res.status(200).json(newFocus);
});

focusRouter.delete("/", async (req, res) => {
  const { taskId } = req.body;
  await Focus.deleteMany({ task: taskId });

  return res.status(200).end();
});

module.exports = focusRouter;
