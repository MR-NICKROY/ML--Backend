const express = require("express");
const { checkFraud } = require("../controllers/fraud.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/check-fraud", auth, checkFraud);

module.exports = router;