const mongoose = require("mongoose");

const regulationSchema = new mongoose.Schema(
  {
    srNo: { type: String, required: true },
    title: { type: String, required: true },
    draftRegulationNo: { type: String, required: true },
    draftRegulationDate: { type: Date, required: true },
    finalRegulationNo: { type: String, required: true },
    finalRegulationDate: { type: Date, required: true },
    dateOfPublication: { type: Date, required: true },
    concernSection: { type: String, required: true },
    pdfFile: { type: String, required: false }, // PDF file path
  },
  { timestamps: true }
);

const Regulation = mongoose.models.Regulation || mongoose.model("Regulation", regulationSchema);

module.exports = Regulation;
