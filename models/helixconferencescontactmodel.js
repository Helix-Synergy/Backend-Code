const mongoose=require("mongoose");
const helixSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    subject:{type:String,required:true},
    message:{type:String,required:true}
},{timestamps:true})
const helixmodel=mongoose.model("helixconferencescontact",helixSchema);
module.exports=helixmodel;