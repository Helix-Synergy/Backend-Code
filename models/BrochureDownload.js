const mongoose = require('mongoose');

const brochureDownloadSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  university: { type: String, required: true },
  affiliation: { type: String, required: true },
  linkedin: { type: String },
  twitter: { type: String },
  interestedIn: { type: String, required: true },
  websiteDomain: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BrochureDownload', brochureDownloadSchema);
