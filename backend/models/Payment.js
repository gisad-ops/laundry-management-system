const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, default: "Cash" },
    paymentStatus: {
      type: String,
      enum: ["PAID", "PARTIALLY PAID", "UNPAID"],
      default: "PAID",
    },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);