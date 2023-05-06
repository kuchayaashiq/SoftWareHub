const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  let obj = {
    a: "aashiq",
    number: 23,
  };
  res.json(obj);
});
module.exports = router;
