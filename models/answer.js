const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const answerSchema = new Schema({
  body: { type: String, required: true },
  username: { type: String },
  user_id: { type: String },
  gravatar: { type: String },
  up_votes: { type: Number },
  down_votes: { type: Number },
  created_at: { type: String },
});

module.exports = mongoose.model("Answer", answerSchema);
