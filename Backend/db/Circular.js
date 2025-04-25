
const mongoose = require("mongoose");

const circularSchema = new mongoose.Schema({
    srNo: String,
    title: String,
  draftCircularNo: Number,
  draftCircularDate:Date,
  finalCircularNo: Number,
  finalCircularDate: Date,
  publicationDate: Date,
  ConcernSection: String,
  pdfFile: String,
});

const Circular = mongoose.model("Circular", circularSchema);

module.exports = Circular;
