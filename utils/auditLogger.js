const AuditLog = require("../models/AuditLog");

const logAudit = async ({ userId, role, action }) => {
  try {
    await AuditLog.create({ userId, role, action });
  } catch (err) {
    console.error("Audit log error:", err.message);
  }
};

module.exports = logAudit;
