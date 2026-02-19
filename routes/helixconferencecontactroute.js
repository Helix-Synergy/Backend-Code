const express=require("express");
const router=express.Router();
const {PostContactForm,GetContactForm}=require("../controllers/helixconferencecontactcontroller")
const validateContactForm=require("../Validtors/helixconferencecontactvalidators")
router.post("/contactform",validateContactForm,PostContactForm)
router.get("/getcontactform",GetContactForm)
module.exports=router;