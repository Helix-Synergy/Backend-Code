const helixsynergyModel = require("../models/helixsyngerymodel");
async function helixsynergyController(req,res){
    try {
        const {name,email,message}=req.body;
        const newEntry = new helixsynergyModel({name,email,message});
        await newEntry.save();
      return  res.status(201).json({success:true,message:"Message received successfully",newEntry});
    }
    catch(error){
        console.error("Error saving synergy message:",error);
        res.status(500).json({success:false,message:"Server error, please try again later"});
    }
}
async function getAllSynergyMessages(req,res){
    try {
        const messages = await helixsynergyModel.find().sort({createdAt:-1});

        res.status(200).json({success:true,data:messages,newEntry:messages});
    }
    catch(error){
        console.error("Error fetching synergy messages:",error);
        res.status(500).json({success:false,message:"Server error, please try again later"});
    }
}
module.exports={helixsynergyController,getAllSynergyMessages};