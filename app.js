const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("express-async-errors");

const { logger, userExtractor, errorHandler } = require("./utils");
const taskRouter = require("./controllers/taskController");
const userRouter = require("./controllers/userController");
const listRouter = require("./controllers/listController");

console.log(process.env.MONGO_URI);
const URI = process.env.MONGO_URI;

mongoose
  .connect(URI)
  .then(() => console.log("connected to MongoDB"))
  .catch((error) =>
    console.log(`error connecting to MongoDB: ${error.message}`)
  );

const app = express();
app.use(cors());
app.use(express.json());
// app.use(logger);

app.use("/api/user", userRouter);

app.use(userExtractor);
app.use("/api/lists", listRouter);
app.use("/api/tasks", taskRouter);

app.use(errorHandler);

module.exports = app;
