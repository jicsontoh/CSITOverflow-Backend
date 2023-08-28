const express = require("express");

const qnsController = require("../controllers/questions-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", qnsController.getQuestions);

router.get("/search/:query?", qnsController.getSearchQuestion);

router.get("/:qid", qnsController.getSpecificQns);

router.use(checkAuth);

router.post("/new", qnsController.postQuestion);

router.patch("/:qid", qnsController.updateQuestion);

router.delete("/:qid", qnsController.deleteQuestion);

router.patch("/vote/:qid", qnsController.voteQuestion);

module.exports = router;
