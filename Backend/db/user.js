const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Name is mandatory
    },
    email: {
        type: String,
        required: true, // Email is mandatory
        unique: true, // Ensure unique email addresses
    },
    password: {
        type: String,
        required: true, // Password is mandatory
    },
});

// Export the user model
const User = mongoose.model("User", userSchema); // 'User' will map to 'users' collection
module.exports =User ;