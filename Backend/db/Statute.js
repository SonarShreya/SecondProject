const mongoose = require("mongoose");

const statuteSchema = new mongoose.Schema({
  title: String,
  draftStatuteNo: String,
  draftStatuteDate: String,
  finalStatuteNo: String,
  finalStatuteDate: String,
  publicationDate: String,
  concernStatute: String,
  pdfFile: String, // Assuming you'll store the file path
});

module.exports = mongoose.model("Statute", statuteSchema);



