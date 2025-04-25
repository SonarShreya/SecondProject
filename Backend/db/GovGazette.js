const mongoose = require("mongoose");

const gazetteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  draftGovNo: { type: String, required: true },
  draftGovDate: { type: String, required: true },
  finalGovNo: { type: String, required: true },
  finalGovDate: { type: String, required: true },
  dateOfPublication: { type: String, required: true },
  concernSection: { type: String, required: true }, // This is the issue!
  pdfFile: { type: String, required: true },
});

const Gazette = mongoose.model("Gazette", gazetteSchema);
module.exports = Gazette;


