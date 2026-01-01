const Transaction = require("../models/Transaction");
const { callMLService } = require("../services/ml.service");
const logAudit = require("../utils/auditLogger");
const classifyRisk = (score) => {
  if (score < 0.3) return "LOW";
  if (score < 0.6) return "MEDIUM";
  return "HIGH";
};

exports.checkFraud = async (req, res) => {
  try {
    const mlResult = await callMLService(req.body);
    const riskLevel = classifyRisk(mlResult.risk_score);

    await logAudit({
      userId: req.userId,
      role: req.userRole,
      action: "ANALYZE_TRANSACTION"
    });

    res.json({
      decision: mlResult.is_fraud ? "FRAUD" : "CLEAN",
      riskLevel,
      riskScore: mlResult.risk_score
    });
  } catch (err) {
    res.status(500).json({
      error: "Fraud analysis failed",
      details: err.message
    });
  }
};

