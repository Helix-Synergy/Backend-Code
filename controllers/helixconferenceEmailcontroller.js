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
return res.json({messaage:"done"})
    }
    catch(error){

    }
}
module.exports={PostEmail,GetEmail}