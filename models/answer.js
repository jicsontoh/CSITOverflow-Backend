const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const answerSchema = new Schema({
  body: { type: String, required: true },
  user_id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  qns_id: { type: mongoose.Types.ObjectId, required: true, ref: "Question" },
  up_votes: { type: Number },
  down_votes: { type: Number },
  created_at: { type: String },
});

module.exports = mongoose.model("Answer", answerSchema);
