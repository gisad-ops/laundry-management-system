const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    weight: { type: Number, required: true },
    pricePerKg: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["PAID", "PARTIALLY PAID", "UNPAID"],
      default: "UNPAID",
    },
    orderStatus: {
      type: String,
      enum: ["Received", "Washing", "Drying", "Folding", "Ready for Pickup", "Claimed"],
      default: "Received",
    },
    completedAt: { type: Date },
    claimedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);