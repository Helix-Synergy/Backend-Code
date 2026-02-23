const express=require("express");
const router2=express.Router();
const {validateHelixSyngery}=require("../Validtors/helixconferencecontactvalidators");
const {helixsynergyController,getAllSynergyMessages}=require("../controllers/helixsyngerycontroller")
 router2.post("/contactform",validateHelixSyngery,helixsynergyController);
 router2.get("/getmessages",getAllSynergyMessages);
module.exports=router2;
