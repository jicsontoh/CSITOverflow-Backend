const express = require("express");

const HttpError = require("../models/http-error");

const router = express.Router();

const users = [
  {
    id: "userid1",
    username: "username",
    gravatar: "m",
    answer_count: 10,
    comment_count: 20,
    post_count: 4,
    votes: 10,
    created_at: "2023/08/14, 13:00",
  },
  {
    id: "userid3",
    username: "username3",
    gravatar: "f",
    answer_count: 10,
    comment_count: 20,
    post_count: 6,
    votes: 11,
    created_at: "2023/07/14, 13:00",
  },
  {
    id: "userid2",
    username: "username2",
    gravatar: "m2",
    answer_count: 5,
    comment_count: 10,
    post_count: 2,
    votes: 15,
    created_at: "2023/06/14, 13:00",
  },
  {
    id: "userid4",
    username: "username4",
    gravatar: "f2",
    answer_count: 7,
    comment_count: 11,
    post_count: 2,
    votes: 20,
    created_at: "2023/06/14, 13:00",
  },
  {
    id: "userid5",
    username: "username5",
    gravatar: "m3",
    answer_count: 8,
    comment_count: 1,
    post_count: 5,
    votes: 20,
    created_at: "2023/06/14, 13:00",
  },
];

router.get("/", (req, res, next) => {
  res.json({ users });
});

router.get("/:uid", (req, res, next) => {
  const userId = req.params.uid;

  const user = users.find((u) => {
    return u.id === userId;
  });

  if (!user) {
    const error = new HttpError("Cannot find such user", 404);
    return next(error);
  }

  res.json({ user });
});

module.exports = router;
