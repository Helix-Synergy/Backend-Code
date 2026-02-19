const mongoose=require("mongoose");
const helixEmailSchema=new mongoose.Schema({
    email:{type:String,required:true}
},{timestamps:true})
const helixEmailModel=mongoose.model("helixconferenceemail",helixEmailSchema);
module.exports=helixEmailModel;