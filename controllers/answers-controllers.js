const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const moment = require("moment");
const Answer = require("../models/answer");
const Question = require("../models/question");
const User = require("../models/user");
const question = require("../models/question");

const getAnswerByQns = async (req, res, next) => {
  const qnsId = req.params.qid;

  let qns_ans;
  try {
    qns_ans = await Question.findById(qnsId).populate("answers");
  } catch (err) {
    const error = new HttpError(
      "Fetching answers failed, please try again later",
      500
    );
    return next(error);
  }

  if (!qns_ans || qns_ans.answers.length === 0) {
    return next(new HttpError("Could not find answers", 404));
  }

  res.json({
    ans: qns_ans.answers.map((ans) => ans.toObject({ getters: true })),
  });
};

const postAnswer = async (req, res, next) => {
  const { answer, user_id, qns_id } = req.body;

  const createdAns = new Answer({
    body: answer,
    user_id: user_id,
    qns_id: qns_id,
    up_votes: 0,
    down_votes: 0,
    created_at: moment(),
  });

  let user;
  try {
    user = await User.findById(user_id);
  } catch (err) {
    const error = new HttpError("Posting Answer failed, user id error", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Posting Answer failed, no such user", 404);
    return next(error);
  }

  let qnswer;
  try {
    qnswer = await Question.findById(qns_id);
  } catch (err) {
    const error = new HttpError("Posting Answer failed, qns id error", 500);
    return next(error);
  }

  if (!qnswer) {
    const error = new HttpError("Posting Answer failed, no such question", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdAns.save({ session: sess });
    user.answers.push(createdAns);
    question.answers.push(createdAns);
    await user.save({ session: sess });
    await question.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Posting Answer failed", 500);
    return next(error);
  }

  res.status(201).json({ createdAns });
};

const updateAnswer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { body } = req.body;
  const ansId = req.params.aid;

  let ans;
  try {
    ans = await Answer.findById(ansId);
  } catch (err) {
    const error = new HttpError("Server error, cannot find answer", 500);
    return next(error);
  }

  ans.body = body;

  try {
    await ans.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update answer.",
      500
    );
    return next(error);
  }

  res.status(200).json({ ans: ans.toObject({ getters: true }) });
};

const deleteAnswer = async (req, res, next) => {
  const ansId = req.params.aid;

  let ans;
  try {
    ans = await Answer.findById(ansId);
  } catch (err) {
    const error = new HttpError("Server error, cannot find answer", 500);
    return next(error);
  }

  if (!ans) {
    const error = new HttpError("Could not find answer", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await ans.remove({ session: sess });
    ans.user_id.answers.pull(ans);
    ans.qns_id.answers.pull(ans);
    await ans.user_id.save({ session: sess });
    await ans.qns_id.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete answer.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted answer." });
};

exports.getAnswerByQns = getAnswerByQns;
exports.postAnswer = postAnswer;
exports.updateAnswer = updateAnswer;
exports.deleteAnswer = deleteAnswer;
