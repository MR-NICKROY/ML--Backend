const AuditLog = require("../models/AuditLog");

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch audit logs"
    });
  }
};
