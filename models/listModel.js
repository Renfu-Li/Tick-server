const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
  {
    listName: {
      type: String,
      required: true,
    },
    tasks: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Task",
      },
    ],
  },
  {
    timestamps: true,
  }
);

listSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("List", listSchema);
