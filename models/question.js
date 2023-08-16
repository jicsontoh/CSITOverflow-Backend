const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const questionSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  username: { type: String },
  user_id: { type: String },
  gravatar: { type: String },
  answer_count: { type: Number },
  comment_count: { type: Number },
  post_count: { type: Number },
  up_votes: { type: Number },
  down_votes: { type: Number },
  created_at: { type: String },
  tags: { type: String },
});

module.exports = mongoose.model("Question", questionSchema);
