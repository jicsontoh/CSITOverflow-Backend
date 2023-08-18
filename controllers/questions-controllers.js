const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const moment = require("moment");
const Question = require("../models/question");

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

const postQuestion = async (req, res, next) => {
  const { title, tags, question, user_id } = req.body;

  const createdQns = new Question({
    title: title,
    body: question,
    tags: tags,
    user_id: user_id,
    created_at: moment(),
    answers: [],
    up_votes: 0,
    down_votes: 0,
  });

  try {
    await createdQns.save();
  } catch (err) {
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

  const { title, body } = req.body;
  const qnsId = req.params.qid;

  let qns;
  try {
    qns = await Question.findById(qnsId);
  } catch (err) {
    const error = new HttpError("Server error, cannot find question", 500);
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
    qns = await Question.findById(qnsId);
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

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await qns.remove({ session: sess });
    // qns.user_id.places.pull(place);
    // await place.creator.save({ session: sess });
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

exports.getQuestions = getQuestions;
exports.getSpecificQns = getSpecificQns;
exports.postQuestion = postQuestion;
exports.updateQuestion = updateQuestion;
exports.deleteQuestion = deleteQuestion;
