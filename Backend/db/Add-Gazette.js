
const mongoose = require('mongoose');

const GazetteSchema = new mongoose.Schema({
  title: String,
  draftGovNo: String,
  draftGovDate: Date,
  finalGovNo: String,
  finalGovDate: Date,
  dateOfPublication: Date,
  concernSection: String,
  pdfFile: String,
});

// ✅ Check if the model already exists before defining it again
const Gazette = mongoose.models.Gazette || mongoose.model('Gazette', GazetteSchema);

module.exports = Gazette;
