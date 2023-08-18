const express = require("express");

const ansControllers = require("../controllers/answers-controllers");

const router = express.Router();

router.get("/:qid", ansControllers.getAnswerByQns);

router.post("/new", ansControllers.postAnswer);

router.patch("/:aid", ansControllers.updateAnswer);

router.delete("/:aid", ansControllers.deleteAnswer);

module.exports = router;
