async function helixsynergyController(req,res){
    try {
        const {name,email,message}=req.body;
        const newEntry = new helixsynergyModel({name,email,message});
        await newEntry.save();
        res.status(201).json({success:true,message:"Message received successfully"});
    }
    catch(error){
        console.error("Error saving synergy message:",error);
        res.status(500).json({success:false,message:"Server error, please try again later"});
    }
}
async function getAllSynergyMessages(req,res){
    try {
        const messages = await helixsynergyModel.find().sort({createdAt:-1});

        res.status(200).json({success:true,data:messages});
    }
    catch(error){
        console.error("Error fetching synergy messages:",error);
        res.status(500).json({success:false,message:"Server error, please try again later"});
    }
}
module.exports={helixsynergyController,getAllSynergyMessages};