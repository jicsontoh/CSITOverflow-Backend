const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  gravatar: { type: String },
  answer_count: { type: Number },
  comment_count: { type: Number },
  post_count: { type: Number },
  votes: { type: Number },
  created_at: { type: String },
  questions: [{ type: mongoose.Types.ObjectId, ref: "Question" }],
});

module.exports = mongoose.model("User", userSchema);
