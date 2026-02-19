const helixmodel = require("../models/helixconferencescontactmodel");
async function PostContactForm(req, res) {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    } else {
      const contact = await helixmodel.create({
        name: name,
        email: email,
        subject: subject,
        message: message,
      });

      return res.status(201).json({
        success: true,
        message: "Contact form submitted successfully",
        data: {
          id: contact._id,
          name:name,
          email:email,
          subject:subject,
          message:message,
          createdAt: contact.createdAt,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
async function GetContactForm(req, res) {
  try {
    const contacts = await helixmodel.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      data: contacts,   // send the array directly
    });

  } catch (error) {
    console.error("GetContactForm Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
module.exports = { PostContactForm, GetContactForm };
