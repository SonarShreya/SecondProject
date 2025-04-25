
require("dotenv").config(); // Load environment variables (Install dotenv if not already installed)
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://shreya:shreya@cluster0.xjhuy.mongodb.net/e-com";

mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 30000, // Increase timeout to avoid quick failure
})
.then(() => {
    console.log("✅ Connected to MongoDB successfully");
})
.catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if connection fails
});

