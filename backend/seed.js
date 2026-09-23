// backend/seed.js
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected!");

    // 1. Create Admin
    const adminEmail = "admin@laundritrack.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Shop Owner",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log("✅ Admin account created!");
      console.log("   Email: admin@laundritrack.com");
      console.log("   Password: admin123");
    } else {
      console.log("ℹ️ Admin account already exists.");
    }

    // 2. Create Staff
    const staffEmail = "staff@laundritrack.com";
    const existingStaff = await User.findOne({ email: staffEmail });

    if (!existingStaff) {
      const hashedPassword = await bcrypt.hash("staff123", 10);
      await User.create({
        name: "Staff Juan",
        email: staffEmail,
        password: hashedPassword,
        role: "staff",
      });
      console.log("✅ Staff account created!");
      console.log("   Email: staff@laundritrack.com");
      console.log("   Password: staff123");
    } else {
      console.log("ℹ️ Staff account already exists.");
    }

    console.log("\n🎉 Seeding complete! You can now login.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err.message);
    process.exit(1);
  }
};

seedDatabase();