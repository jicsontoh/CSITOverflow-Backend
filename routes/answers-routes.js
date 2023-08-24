const express = require("express");

const ansControllers = require("../controllers/answers-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/:qid", ansControllers.getAnswerByQns);

router.use(checkAuth);

router.post("/new", ansControllers.postAnswer);

router.patch("/:aid", ansControllers.updateAnswer);

router.delete("/:aid", ansControllers.deleteAnswer);

router.patch("/vote/:aid", ansControllers.voteAnswer);

module.exports = router;
