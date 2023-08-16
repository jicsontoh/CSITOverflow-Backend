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

app.listen(8080);
