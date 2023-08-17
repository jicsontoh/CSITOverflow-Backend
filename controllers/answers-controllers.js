const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const moment = require("moment");
const Answer = require("../models/answer");

const getQuestionAns = async (req, res, next) => {
  const qnsId = req.params.qid;

  let answers;
  try {
    answers = await Answer.find({ qns_id: qnsId });
  } catch (err) {
    const error = new HttpError(
      "Fetching answers failed, please try again later",
      500
    );
    return next(error);
  }

  if (!answers || answers.places.length === 0) {
    return next(
      new HttpError("Could not find answers for the provided qns_id.", 404)
    );
  }

  res.json({
    answers: answers.map((ans) => ans.toObject({ getters: true })),
  });
};

const postAnswer = async (req, res, next) => {
  const { answer, userId, qnsId } = req.body;

  const createdAns = new Answer({
    body: answer,
    user_id: userId,
    qns_id: qnsId,
    up_votes: 5,
    down_votes: 1,
    created_at: moment(),
  });

  try {
    await createdAns.save();
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
    // qns.user_id.places.pull(place);
    // await place.creator.save({ session: sess });
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

exports.getQuestionAns = getQuestionAns;
exports.postAnswer = postAnswer;
exports.updateAnswer = updateAnswer;
exports.deleteAnswer = deleteAnswer;
