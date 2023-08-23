const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const answerSchema = new Schema({
  body: { type: String, required: true },
  user_id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  username: { type: String, required: true },
  gravatar: { type: String, required: true },
  qns_id: { type: mongoose.Types.ObjectId, required: true, ref: "Question" },
  up_votes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  down_votes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  created_at: { type: String },
});

module.exports = mongoose.model("Answer", answerSchema);
