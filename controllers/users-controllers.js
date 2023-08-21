const HttpError = require("../models/http-error");

const moment = require("moment");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const getSpecificUser = async (req, res, next) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Server error, cannot find user", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Cannot find such user", 404);
    return next(error);
  }

  res.json({ user: user.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  let user;
  try {
    user = await User.findOne({ username: username });
  } catch (err) {
    const error = new HttpError("Server error, cannot find user", 500);
    return next(error);
  }

  if (!user || user.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  res.status(201).json({ user: user.toObject({ getters: true }) });
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
    gravatar: "avatar_img",
    votes: 0,
    questions: [],
    answers: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signing up failed", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.getSpecificUser = getSpecificUser;
exports.login = login;
exports.signup = signup;
