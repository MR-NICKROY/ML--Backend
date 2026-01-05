const express = require("express");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const controller = require("../controllers/transaction.controller");

const router = express.Router();

router.post("/transactions/manual", auth, controller.addManualTransaction);
router.get("/transactions/my", auth, controller.getMyTransactions);

router.post("/admin/transactions", auth, role("ADMIN"), controller.adminAddTransaction);
router.delete("/admin/transactions/:id", auth, role("ADMIN"), controller.deleteTransaction);
router.get("/admin/all-transactions", auth, role("ADMIN"), controller.getAllTransactions);

module.exports = router;
