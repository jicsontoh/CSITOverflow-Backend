const HttpError = require("../models/http-error");

const moment = require("moment");
const Question = require("../models/question");

const questions = [
  {
    id: "1",
    title: "qns title",
    body: "question body",
    username: "username",
    gravatar: "image",
    user_id: "userid1",
    answer_count: 10,
    comment_count: 20,
    views: 27,
    votes: 10,
    created_at: "2023/08/14, 13:00",
    tags: "tags",
  },
  {
    id: "2",
    title: "qns title2",
    body: "question body222",
    username: "username",
    gravatar: "image",
    user_id: "userid1",
    answer_count: 10,
    comment_count: 20,
    views: 30,
    votes: 11,
    created_at: "2023/07/14, 13:00",
    tags: "tags",
  },
  {
    id: "3",
    title: "qns title3",
    body: "question body333",
    username: "username2",
    gravatar: "image",
    user_id: "userid2",
    answer_count: 5,
    comment_count: 10,
    views: 24,
    votes: 15,
    created_at: "2023/06/14, 13:00",
    tags: "tags",
  },
];

const getQuestions = (req, res, next) => {
  res.json({ questions });
};

const getSpecificQns = (req, res, next) => {
  const qnsId = req.params.qid;

  const qns = questions.find((q) => {
    return q.id === qnsId;
  });

  if (!qns) {
    const error = new HttpError("Cannot find such question", 404);
    return next(error);
  }

  res.json({ qns });
};

const postQuestion = async (req, res, next) => {
  const { title, tags, question } = req.body;

  const createdQns = new Question({
    title: title,
    body: question,
    username: "username2",
    gravatar: "image",
    user_id: "userid2",
    answer_count: 5,
    comment_count: 10,
    views: 24,
    votes: 15,
    created_at: moment(),
    tags: "tags",
  });

  try {
    await createdQns.save();
  } catch (err) {
    const error = new HttpError("Posting Question failed", 500);
    return next(error);
  }

  res.status(201).json({ createdQns });
};

const updateQuestion = (req, res, next) => {};

exports.getQuestions = getQuestions;
exports.getSpecificQns = getSpecificQns;
exports.postQuestion = postQuestion;
exports.updateQuestion = updateQuestion;
