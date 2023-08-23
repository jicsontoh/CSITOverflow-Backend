const express = require("express");

const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.get("/:uid", usersControllers.getSpecificUser);

router.get("/questions/:uid", usersControllers.getUserQuestions);

router.post("/login", usersControllers.login);

router.post("/signup", usersControllers.signup);

module.exports = router;
