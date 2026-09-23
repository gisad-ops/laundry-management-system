const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    serviceName: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    unit: { type: String, default: "kg" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);