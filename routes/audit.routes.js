const express = require("express");
const { getAuditLogs } = require("../controllers/audit.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

const router = express.Router();

// 🔐 ADMIN ONLY
router.get("/audit-logs", auth, role("ADMIN"), getAuditLogs);

module.exports = router;
