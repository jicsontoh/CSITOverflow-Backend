const HttpError = require("../models/http-error");

const moment = require("moment");
const User = require("../models/user");

const users = [
  {
    id: "userid1",
    username: "username",
    password: "password",
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
    password: "password",
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
    password: "password",
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
    password: "password",
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
    password: "password",
    gravatar: "m3",
    answer_count: 8,
    comment_count: 1,
    post_count: 5,
    votes: 20,
    created_at: "2023/06/14, 13:00",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users });
};

const getSpecificUser = (req, res, next) => {
  const userId = req.params.uid;

  const user = users.find((u) => {
    return u.id === userId;
  });

  if (!user) {
    const error = new HttpError("Cannot find such user", 404);
    return next(error);
  }

  res.json({ user });
};

const login = (req, res, next) => {
  const { username, password } = req.body;
};

const signup = async (req, res, next) => {
  const { username, password, reenterpwd } = req.body;

  if (password !== reenterpwd) {
    const error = new HttpError("Password does not match", 404);
    return next(error);
  }

  const createdUser = new User({
    username: username,
    password: password,
    created_at: moment(),
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser });
};

exports.getUsers = getUsers;
exports.getSpecificUser = getSpecificUser;
exports.login = login;
exports.signup = signup;
