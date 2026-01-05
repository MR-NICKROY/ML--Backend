const express = require("express");
const auth = require("../middlewares/auth.middleware");
const {
  getSampleTransactions,
  analyzeSampleTransaction
} = require("../controllers/sample.controller");

const router = express.Router();

// Anyone logged in can use sample data
router.get("/samples", auth, getSampleTransactions);
router.post("/samples/analyze", auth, analyzeSampleTransaction);

module.exports = router;
