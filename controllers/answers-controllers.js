const HttpError = require("../models/http-error");

const moment = require("moment");

const answers = [
  {
    id: "1",
    body: "answer body",
    user_id: "userid1",
    qns_id: "1",
    up_votes: 10,
    down_votes: 3,
    created_at: "2023/07/14, 18:00",
  },
  {
    id: "2",
    body: "answer body2",
    user_id: "userid2",
    qns_id: "2",
    up_votes: 20,
    down_votes: 5,
    created_at: "2023/08/14, 18:00",
  },
  {
    id: "3",
    body: "answer body3",
    user_id: "userid3",
    qns_id: "3",
    up_votes: 5,
    down_votes: 1,
    created_at: "2022/07/14, 18:00",
  },
];

const getQuestionAns = (req, res, next) => {
  const qnsId = req.params.qid;

  const ans = answers.find((a) => {
    return a.qns_id === qnsId;
  });

  if (!ans) {
    const error = new HttpError("Cannot find such answer", 404);
    return next(error);
  }

  res.json({ ans });
};

const postAnswer = (req, res, next) => {
  const { answer, userId, qnsId } = req.body;

  const createdAns = {
    id: "3",
    body: answer,
    user_id: "userid3",
    qns_id: "3",
    up_votes: 5,
    down_votes: 1,
    created_at: moment(),
  };

  answers.push(createdAns);

  res.status(201).json({ createdAns });
};

const updateAnswer = (req, res, next) => {};

exports.getQuestionAns = getQuestionAns;
exports.postAnswer = postAnswer;
exports.updateAnswer = updateAnswer;
