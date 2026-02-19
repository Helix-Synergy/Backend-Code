const express=require("express");
const router1=express.Router();
const {PostEmail,GetEmail}=require("../controllers/helixconferenceEmailcontroller")
const {validateEmail}=require("../Validtors/helixconferencecontactvalidators");
router1.post("/email",validateEmail,PostEmail);
router1.get("/getemail",GetEmail)
module.exports=router1;