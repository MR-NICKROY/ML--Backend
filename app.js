const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const auditRoutes = require("./routes/audit.routes");
const authRoutes = require("./routes/auth.routes");
const fraudRoutes = require("./routes/fraud.routes");
const transactionRoutes = require("./routes/transaction.routes");
const sampleRoutes = require("./routes/sample.routes");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", fraudRoutes);
app.use("/api", transactionRoutes);
app.use("/api/admin", auditRoutes);
app.use("/api", sampleRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

module.exports = app;
