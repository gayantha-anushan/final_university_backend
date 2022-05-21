const mongoose = require('mongoose')
const Schema = mongoose.Schema
const reportSchema = new Schema({
    // need user id as reference
    title:{
        type : String,
        required : true,
    },
    author : {
        type : String,
        required : true,
    },
    receiver : {
        type: String,
        required : true,
    },
    date:{
        type : String,
        required : true,
    },
    description:String,
});

module.exports = mongoose.model("Report" , reportSchema);