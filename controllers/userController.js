const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const Task = require("../models/taskModel");
const Router = require("express").Router;

const userRouter = Router();

// handle user signup
userRouter.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({ error: "missing username or password" });
  }

  const userExists = await User.findOne({ username });
  if (userExists) {
    return res
      .status(400)
      .json({ error: "username already taken. choose another one" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const newUser = new User({ username, passwordHash });

  await newUser.save();
  return res.status(200).json(newUser);
});

// handle user login
userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({ error: "missing username or password" });
  }

  const user = await User.findOne({ username });
  const passwordCorrect = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!passwordCorrect) {
    return res.status(401).json({ error: "wrong username or password" });
  }

  const userForToken = {
    username,
    id: user._id,
  };

  // add { expiresIn: "3h" } later
  const token = jwt.sign(userForToken, process.env.SECRET);
  return res.status(200).json({ token, username });
});

// get all users (for api testing)
userRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("lists");
  return res.status(200).json(users);
});

// delete a user
userRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const deletedUser = await User.findByIdAndDelete(id);

  await Task.deleteMany({ user: id });

  return res.status(200).json(deletedUser);
});

module.exports = userRouter;
