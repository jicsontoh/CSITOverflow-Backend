const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("GET");
  res.send("ANSWERS");
});

module.exports = router;
