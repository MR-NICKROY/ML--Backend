const Transaction = require("../models/Transaction");
const { callMLService } = require("../services/ml.service");
const logAudit = require("../utils/auditLogger");

// UPDATED RISK THRESHOLDS
const classifyRisk = (score) => {
  if (score <= 0.35) return "LOW";    // 0.00 - 0.35
  if (score <= 0.50) return "MEDIUM"; // 0.36 - 0.50
  return "HIGH";                      // 0.51 - 1.00
};

exports.checkFraud = async (req, res) => {
  try {
    // 1. Construct Payload Explicitly
    // We use destructuring to ensure SuspiciousFlag is caught, and default it to 0 if missing.
    const payload = {
      ...req.body, // Include all other fields (TransactionAmount, Timestamp, etc.)
      SuspiciousFlag: req.body.SuspiciousFlag || 0 
    };

    // 2. Call Python ML Service with the sanitized payload
    const mlResult = await callMLService(payload);
    
    // 3. Determine Risk Level based on Score
    const riskLevel = classifyRisk(mlResult.risk_score);

    // 4. Log the action
    await logAudit({
      userId: req.userId,
      role: req.userRole,
      action: "ANALYZE_TRANSACTION"
    });

    // 5. Return Result
    res.json({
      decision: mlResult.is_fraud ? "FRAUD" : "CLEAN",
      riskLevel: riskLevel,
      riskScore: mlResult.risk_score,
      details: mlResult.debug_tags // Shows why (spike, weekend, SuspiciousFlag, etc.)
    });

  } catch (err) {
    console.error("Fraud Check Error:", err.message);
    res.status(500).json({
      error: "Fraud analysis failed",
      details: err.message
    });
  }
};
