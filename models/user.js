const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 1 },
  gravatar: { type: String },
  votes: { type: Number },
  created_at: { type: String },
  questions: [{ type: mongoose.Types.ObjectId, ref: "Question" }],
  answers: [{ type: mongoose.Types.ObjectId, ref: "Answer" }],
});

module.exports = mongoose.model("User", userSchema);
