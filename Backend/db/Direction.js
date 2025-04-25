// const mongoose = require('mongoose');

// // Define the schema for Direction
// const directionSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   draftDirectionNo: { type: String, required: true },
//   draftDirectionDate: { type: Date, required: true },
//   dateOfRenewal: { type: Date, required: true },
//   concernSection: { type: String, required: true },
//   pdfFile: { type: String, required: true }, // Store the filename of the uploaded PDF
// });

// // Create the model
// const Direction = mongoose.model('Direction', directionSchema);

// module.exports = Direction;
const mongoose = require("mongoose");

const directionSchema = new mongoose.Schema({
  title: String,
  draftDirectionNo: Number,
  draftDirectionDate: Date,
  dateOfRenewal: Date,
  concernSection: String,
  pdfFile: String, // Path to uploaded PDF
});

module.exports = mongoose.model("Direction", directionSchema);
