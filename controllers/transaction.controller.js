const Transaction = require("../models/Transaction");
const { callMLService } = require("../services/ml.service");
const logAudit = require("../utils/auditLogger");

exports.addManualTransaction = async (req, res) => {
  try {
    // 1. Prepare Payload with Default
    const payload = {
      ...req.body,
      SuspiciousFlag: req.body.SuspiciousFlag || 0 // Default to 0 if missing
    };

    // 2. Call ML Service
    const mlData = await callMLService(payload);

    // 3. Save to Database (using payload to ensure 0 is saved)
    const transaction = await Transaction.create({
      userId: req.userId,
      ...payload, 
      isFraud: mlData.is_fraud,
      riskScore: mlData.risk_score
    });

    await logAudit({
      userId: req.userId,
      role: req.userRole,
      action: "USER_ADD_TRANSACTION"
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: "Failed to add transaction", details: err.message });
  }
};

// 3️⃣ USER – View their own transactions
exports.getMyTransactions = async (req, res) => {
  try {
    const data = await Transaction.find({ userId: req.userId });

    await logAudit({
      userId: req.userId,
      role: req.userRole,
      action: "USER_VIEW_OWN_TRANSACTIONS"
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// 4️⃣ ADMIN – Add transaction for any user
exports.adminAddTransaction = async (req, res) => {
  try {
    const { userId, ...txnData } = req.body;

    // 1. Prepare Payload with Default
    const payload = {
      ...txnData,
      SuspiciousFlag: txnData.SuspiciousFlag || 0 // Default to 0
    };

    // 2. Call ML Service
    const mlData = await callMLService(payload);

    // 3. Save to DB
    const transaction = await Transaction.create({
      userId,
      ...payload,
      isFraud: mlData.is_fraud,
      riskScore: mlData.risk_score
    });

    await logAudit({
      userId: req.userId,
      role: "ADMIN",
      action: "ADMIN_ADD_TRANSACTION"
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: "Failed to add transaction", details: err.message });
  }
};

// 5️⃣ ADMIN – Delete any transaction
exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);

    await logAudit({
      userId: req.userId,
      role: "ADMIN",
      action: "ADMIN_DELETE_TRANSACTION"
    });

    res.json({ message: "Transaction removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
};

// 6️⃣ ADMIN – View all users + their transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const data = await Transaction.find()
      .populate("userId", "name email role");

    await logAudit({
      userId: req.userId,
      role: "ADMIN",
      action: "ADMIN_VIEW_ALL_TRANSACTIONS"
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all transactions" });
  }
};
