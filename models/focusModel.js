const mongoose = require("mongoose");

const focusSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.ObjectId,
    ref: "Task",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  focusNote: String,
});

focusSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Focus", focusSchema);
