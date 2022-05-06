const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    uid:String,
    firstname:String,
    lastname:String,
    address:String,
    contact:String
});

module.exports = mongoose.model("Profile" , profileSchema);