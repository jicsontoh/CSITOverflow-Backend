const express = require("express");
const bodyParser = require("body-parser");

const usersRoutes = require("./routes/users-routes");
const questionsRoutes = require("./routes/questions-routes");
const answersRoutes = require("./routes/answers-routes");

const app = express();

app.use(bodyParser.json());

app.use("/api/users", usersRoutes);

app.use("/api/questions", questionsRoutes);

app.use("/api/answers", answersRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "Unknown error occurred" });
});

app.listen(8080);
