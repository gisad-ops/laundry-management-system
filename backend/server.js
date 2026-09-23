// 1. FORCE GOOGLE DNS (This must be at the very top)
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

// 2. Standard Imports
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

// 3. Internal Imports
const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reportRoutes = require("./routes/reportRoutes");

// 4. Security Imports
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// 5. Initialize App & Connect to Database
const app = express();
connectDB();

// 6. Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

// Rate limiter (Mataas muna ang limit para sa development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// 7. Routes
app.get("/", (req, res) => res.json({ message: "LaundriTrack API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reports", reportRoutes);

// 8. Error Handling Middleware
app.use(errorMiddleware);

// 9. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));