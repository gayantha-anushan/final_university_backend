const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const ProfileSchema = new Schema({
    loginID:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    firstname:String,
    lastname:String,
    address:{
        line1:String,
        line2:String,
        line3:String
    },
    geolocation:{
        latitude:mongoose.Types.Decimal128,
        longitude:mongoose.Types.Decimal128
    }
})

module.exports = mongoose.model("profile",ProfileSchema)