const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    TransactionAmount: Number,
    Timestamp: Date,
    LastLogin: Date,
    Category: String,
    AnomalyScore: Number,
    Transaction_Frequency: Number,
    Total_Linked_Value: Number,
    SuspiciousFlag: Number,

    // ML result
    isFraud: Boolean,
    riskScore: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
