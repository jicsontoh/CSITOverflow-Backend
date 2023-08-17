const express = require("express");

const ansControllers = require("../controllers/answers-controllers");

const router = express.Router();

router.get("/qns/:qid", ansControllers.getQuestionAns);

router.post("/new", ansControllers.postAnswer);

router.patch("/:aid", ansControllers.updateAnswer);

router.delete("/:aid", ansControllers.deleteAnswer);

module.exports = router;
