const mongoose =require("mongoose");
const helixsynergySchema = new mongoose.Schema({
name:{type:String,required:true},
email:{type:String,required:true},
message:{type:String,required:true},
});
const helixsynergyModel = mongoose.model("helixsynergy",helixsynergySchema);
module.exports = helixsynergyModel;
