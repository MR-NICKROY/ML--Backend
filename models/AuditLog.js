const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      required: true
    },
    action: {
      type: String,
      required: true
    }
  },
  { timestamps: true } // createdAt = WHEN
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
