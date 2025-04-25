// const mongoose = require("mongoose");

// const LoginSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// const Login = mongoose.model("Login", LoginSchema);

// module.exports = Login;


// const mongoose = require("mongoose");

// const LoginSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   lastLogin: { type: Date },
// });

// const Login = mongoose.model("Login", LoginSchema);

// module.exports = Login;


// const mongoose = require("mongoose");

// const loginSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// });

// const Login = mongoose.model("login", loginSchema);

// module.exports = Login;


const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const loginSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }
});

// Hash password before saving
loginSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Login = mongoose.model("Login", loginSchema);
module.exports = Login;
