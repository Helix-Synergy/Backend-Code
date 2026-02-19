const validator = require("validator");

async function validateContact(req, res, next) {
  let { name, email, subject, message } = req.body;

  if (
    !name || !email || !subject || !message ||
    !name.trim() || !subject.trim() || !message.trim()
  ) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  if (name.length > 50 || subject.length > 100 || message.length > 1000) {
    return res.status(400).json({
      success: false,
      message: "Input length exceeded",
    });
  }

  req.body = {
    name: validator.escape(name.trim()),
    email: validator.normalizeEmail(email.trim()),
    subject: validator.escape(subject.trim()),
    message: validator.escape(message.trim()),
  };

  next();
};
async  function validateEmail(req,res,next){
    let {email}=req.body;
    if(!email || !email.trim()){
        return res.status(400).json({success:false,message:"Email is required"})
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({success:false,message:"Invalid email format"})
    }
    if(email.length>100){
        return res.status(400).json({success:false,message:"Email length exceeded"})
    }
    req.body={
        email:validator.normalizeEmail(email.trim())
    }
    next();
}
module.exports = { validateContact, validateEmail };