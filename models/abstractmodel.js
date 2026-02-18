const mongoose = require("mongoose");

const abstractSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    university: { type: String, required: true },
    email: { type: String, required: true },
    affiliation: { type: String, required: true },
    linkedin: { type: String },
    twitter: { type: String },
    abstractTitle: { type: String, required: true },
    interestedIn: { type: String, required: true },
    websiteDomain: { type: String, required: true },

    abstractFile: {
      filename: String,
      contentType: String,
      data: Buffer,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Abstract", abstractSchema);
