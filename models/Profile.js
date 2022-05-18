const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Login",
        unique:true
    },
    firstname:String,
    lastname:String,
    address:String,
    contact:String,
    latitude:Number,
    longitude:Number,
    type:String
});

module.exports = mongoose.model("Profile" , profileSchema);