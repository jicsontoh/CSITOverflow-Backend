const express = require("express");

const qnsController = require("../controllers/questions-controllers");

const router = express.Router();

router.get("/", qnsController.getQuestions);

router.get("/:qid", qnsController.getSpecificQns);

router.post("/new", qnsController.postQuestion);

router.patch("/:qid", qnsController.updateQuestion);

module.exports = router;
