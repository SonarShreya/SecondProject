const mongoose = require("mongoose");

const OrdinanceSchema = new mongoose.Schema({
  // srNo: { type: Number, required: true },
  title: { type: String, required: true },
  draftOrdinanceNo:{ type: Number},
  draftOrdinanceDate:{ type: Date},
  finalOrdinanceNo: { type:Number},
  finalOrdinanceDate: { type:Date},
  dateOfPublication: { type:Date},
  concernSection: { type:String},
  pdfFile: { type:String}, // This will store the file path or URL
});

module.exports = mongoose.model("Ordinance", OrdinanceSchema);



