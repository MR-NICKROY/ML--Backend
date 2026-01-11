const Transaction = require("../models/Transaction");
const { callMLService } = require("../services/ml.service");
const logAudit = require("../utils/auditLogger");

// UPDATED RISK THRESHOLDS
const classifyRisk = (score) => {
  if (score <= 0.35) return "LOW";    // Increased from 0.2 to 0.3 to catch your 0.22 scores
  if (score <= 0.50) return "MEDIUM"; // 0.31 - 0.50
  return "HIGH";                      // 0.51 - 1.00
};

exports.checkFraud = async (req, res) => {
  try {
    // 1. Call Python ML Service
    const mlResult = await callMLService(req.body);
    
    // 2. Determine Risk Level based on Score
    const riskLevel = classifyRisk(mlResult.risk_score);

    // 3. Log the action
    await logAudit({
      userId: req.userId,
      role: req.userRole,
      action: "ANALYZE_TRANSACTION"
    });

    // 4. Return Result
    res.json({
      decision: mlResult.is_fraud ? "FRAUD" : "CLEAN",
      riskLevel: riskLevel,
      riskScore: mlResult.risk_score,
      details: mlResult.debug_tags // Shows why (spike, weekend, etc.)
    });

  } catch (err) {
    console.error("Fraud Check Error:", err.message);
    res.status(500).json({
      error: "Fraud analysis failed",
      details: err.message
    });
  }
};