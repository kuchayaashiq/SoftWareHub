const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchama = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    unique: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("notes", NotesSchama);
