const mongoose = require("mongoose");
const ContactSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String,required:true}, // optional
    company: { type: String,required:true }, // optional
    message: { type: String, required: true },
    websiteDomain: { type: String, required: true }, // automatically set from frontend
  },
  { timestamps: true } // keeps track of createdAt and updatedAt
);

const ContactModel = mongoose.model("ContactDetails", ContactSchema);

module.exports = ContactModel;
