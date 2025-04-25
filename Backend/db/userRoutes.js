const express = require("express");
const router = express.Router();
const User = require("./user");
const Login = require("./Login");


// // **POST API: Create User**
// router.post("/createuser", async (req, res) => {
//   try {
//       const { name, email, password } = req.body;
// // Backend code
// let existingUser = await User.findOne({ email });
// if (existingUser) {
//   return res.status(400).json({ message: "User already exists" });
// }


//       const newUser = new User({ name, email, password });
//       await newUser.save();

//       res.status(201).json({ message: "User created successfully", result: newUser });
//   } catch (error) {
//       res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

// **POST API: Create User**
router.post("/createuser", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    const login = new Login({ email, password: password });
    await login.save();

    res.status(201).json({ message: "User created successfully", result: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


// **GET API: Retrieve Users**
router.get("/api/user/getusers", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

module.exports = router;