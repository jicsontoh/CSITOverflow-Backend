const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const moment = require("moment");

const Question = require("../models/question");
const User = require("../models/user");

const getQuestions = async (req, res, next) => {
  let questions;
  try {
    questions = await Question.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching questions failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    questions: questions.map((qns) => qns.toObject({ getters: true })),
  });
};

const getSpecificQns = async (req, res, next) => {
  const qnsId = req.params.qid;

  let qns;
  try {
    qns = await Question.findById(qnsId);
  } catch (err) {
    const error = new HttpError("Server error, cannot find question", 500);
    return next(error);
  }

  if (!qns) {
    const error = new HttpError("Cannot find such question", 404);
    return next(error);
  }

  res.json({ qns: qns.toObject({ getters: true }) });
};

const getSearchQuestion = async (req, res, next) => {
  const query = req.params.query;

  let questions;
  try {
    questions = await Question.find({
      $text: { $search: query, $caseSensitive: false },
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching questions failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    questions: questions.map((qns) => qns.toObject({ getters: true })),
  });
};

const postQuestion = async (req, res, next) => {
  const { title, tags, question } = req.body;

  const user_id = req.userData.userId;

  let user;
  try {
    user = await User.findById(user_id);
  } catch (err) {
    const error = new HttpError("Posting Question failed, user id error", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Posting Question failed, no such user", 404);
    return next(error);
  }

  const createdQns = new Question({
    title: title,
    body: question,
    tags: tags,
    user_id: user_id,
    username: user.username,
    gravatar: user.gravatar,
    created_at: moment(),
    answers: [],
    up_votes: [],
    down_votes: [],
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdQns.save({ session: sess });
    user.questions.push(createdQns);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Posting Question failed", 500);
    return next(error);
  }

  res.status(201).json({ createdQns });
};

const updateQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, body, up_votes, down_votes } = req.body;
  const qnsId = req.params.qid;

  let qns;
  try {
    qns = await Question.findById(qnsId);
  } catch (err) {
    const error = new HttpError("Server error, cannot find question", 500);
    return next(error);
  }

  if (qns.user_id.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not authorized to edit this question.",
      401
    );
    return next(error);
  }

  qns.title = title;
  qns.body = body;

  try {
    await qns.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update question.",
      500
    );
    return next(error);
  }

  res.status(200).json({ qns: qns.toObject({ getters: true }) });
};

const deleteQuestion = async (req, res, next) => {
  const qnsId = req.params.qid;

  let qns;
  try {
    qns = await Question.findById(qnsId).populate("user_id");
  } catch (err) {
    const error = new HttpError(
      "Server error, could not delete question.",
      500
    );
    return next(error);
  }

  if (!qns) {
    const error = new HttpError("Could not find question", 404);
    return next(error);
  }

  if (qns.user_id.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not authorized to delete this question.",
      401
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await qns.deleteOne({ session: sess });
    qns.user_id.questions.pull(qns);
    await qns.user_id.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete question.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted question." });
};

const voteQuestion = async (req, res, next) => {
  const { up_id, down_id } = req.body;
  const qnsId = req.params.qid;

  let qns;
  try {
    qns = await Question.findById(qnsId);
  } catch (err) {
    const error = new HttpError("Server error, cannot find question", 500);
    return next(error);
  }

  if (up_id) {
    if (!qns.up_votes.includes(up_id)) {
      qns.up_votes.push(up_id);
    } else {
      qns.up_votes.pull(up_id);
    }
  }

  if (down_id) {
    if (!qns.down_votes.includes(down_id)) {
      qns.down_votes.push(down_id);
    } else {
      qns.down_votes.pull(down_id);
    }
  }

  try {
    await qns.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update question.",
      500
    );
    return next(error);
  }

  res.status(200).json({ qns: qns.toObject({ getters: true }) });
};

exports.getQuestions = getQuestions;
exports.getSpecificQns = getSpecificQns;
exports.getSearchQuestion = getSearchQuestion;
exports.postQuestion = postQuestion;
exports.updateQuestion = updateQuestion;
exports.deleteQuestion = deleteQuestion;
exports.voteQuestion = voteQuestion;
