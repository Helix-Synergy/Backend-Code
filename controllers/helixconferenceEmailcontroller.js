const helixEmailModel=require("../models/helixconferenceEmailmodel")
async function PostEmail(req,res){
    try {
        const {email}=req.body;
        if(!email){
            return res.status(400).json({success:false,message:"Email is required"})    
        }
        else{
const newEmail=new helixEmailModel({email});
await newEmail.save();
return res.status(201).json({success:true,message:"Email saved successfully",id:newEmail._id,email:newEmail.email,createdAt:newEmail.createdAt})
        }

     
    } catch (error) {
       return res.status(500).json({message:error.message}); 
    }
}
async function GetEmail(req,res){
    try{
const emails=await helixEmailModel.find().sort({createdAt:-1}).lean();
return res.status(200).json({success:true,count:emails.length,emails:emails.map(e=>({id:e._id,email:e.email,createdAt:e.createdAt}))})
    }
    catch(error){
return res.status(500).json({success:false,message:error.message});
    }
}
module.exports={PostEmail,GetEmail}