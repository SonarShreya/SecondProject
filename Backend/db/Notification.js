
// const mongoose = require("mongoose");

// const notificationSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   draftRegNo: String,
//   finalRegNo: String,
//   dateOfPublication: String,
//   concernSection: String,
//   pdfFile: String,
// });

// module.exports = mongoose.model("Notification", notificationSchema);
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: String,
  draftNotificationNo: String,
  draftNotificationDate: Date,
  finalNotificationNo: String,
  finalNotificationDate: Date,
  dateOfPublication: Date,
  concernSection: String,
  pdfFile: String,
});

module.exports = mongoose.model('Notification', notificationSchema);  // Ensure the collection name matches



