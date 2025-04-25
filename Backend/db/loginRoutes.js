const express = require("express");
const bcrypt = require("bcryptjs");
const Login = require("./Login"); // Import the Login model
const router = express.Router();



router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
console.log({email})
    // Normalize email
    const user = await Login.findOne({ email: email.toLowerCase().trim() });
    console.log(user,"-----------------user-----------")
    if (!user) {
      return res.status(404).json({ message: "User not found" });


      
    }

    // Check if password matches (hashed in DB)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Send only the original email and password back (not the hashed password)
    res.status(200).json({ 
      message: "Login successful", 
      email: user.email, 
      password: password  // Sending back original entered password (not hashed one)
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



//🔹 GET: Fetch all users (excluding passwords)
router.get("/api/getlogin", async (req, res) => {
  try {
    const users = await Login.find().select("-password"); // Exclude password field

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});


module.exports = router;
