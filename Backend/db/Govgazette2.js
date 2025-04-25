// the schema is Gazette 



const mongoose = require('mongoose');

const gazetteSchema = new mongoose.Schema({
  title: String,
  draftGovNo: Number,
  draftGovDate: Date,
  finalGovNo: Number,
  finalGovDate: Date,
  dateOfPublication: Date,
  concernSection: String,
  pdfFile: String,
});

module.exports = mongoose.model('GovGazettes', gazetteSchema);

