const fs = require("fs");
const path = require("path");
const { callMLService } = require("../services/ml.service");
const logAudit = require("../utils/auditLogger");

// Get all sample transactions (read-only)
exports.getSampleTransactions = (req, res) => {
  try {
    const filePath = path.join(__dirname, "../data/transactions.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to load sample data" });
  }
};

// Analyze ONE sample transaction (NO DB SAVE)
exports.analyzeSampleTransaction = async (req, res) => {
  try {
    const mlData = await callMLService(req.body);

    await logAudit({
      userId: req.userId,
      role: req.userRole,
      action: "ANALYZE_SAMPLE_TRANSACTION"
    });

    res.json({
      input: req.body,
      result: mlData
    });
  } catch (err) {
    res.status(500).json({ error: "Analysis failed", details: err.message });
  }
};