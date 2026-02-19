const express=require("express");
const router=express.Router();
const {PostContactForm,GetContactForm}=require("../controllers/helixconferencecontactcontroller")
const {validateContact}=require("../Validtors/helixconferencecontactvalidators")
router.post("/contactform",validateContact,PostContactForm)
router.get("/getcontactform",GetContactForm)
module.exports=router;