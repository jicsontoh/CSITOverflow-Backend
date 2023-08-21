const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const HttpError = require("./models/http-error");

const usersRoutes = require("./routes/users-routes");
const questionsRoutes = require("./routes/questions-routes");
const answersRoutes = require("./routes/answers-routes");

const app = express();
dotenv.config();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/users", usersRoutes);

app.use("/api/questions", questionsRoutes);

app.use("/api/answers", answersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find such path", 404);
  next(error);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "Unknown error occurred" });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
