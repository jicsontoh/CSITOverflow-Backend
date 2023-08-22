const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const questionSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: { type: String },
  user_id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  answers: [{ type: mongoose.Types.ObjectId, ref: "Answer" }],
  up_votes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  down_votes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  created_at: { type: String },
});

module.exports = mongoose.model("Question", questionSchema);
