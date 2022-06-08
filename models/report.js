const mongoose = require('mongoose')
const Schema = mongoose.Schema
const reportSchema = new Schema({
    title:{
        type : String,
        required : true,
    },
    reporterId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required : true,
    },
    reporteeId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required : true,
    },
    date:{
        type : String,
        required : true,
    },
    description:String,
});

module.exports = mongoose.model("Report" , reportSchema);

/*

{
    "reporterId" : "628bd634025ab700166d3416",
    "reporteeId" : "628b1e0aed7d940016506aa6",
    "title" : "test report",
    "date" : "2022-01-01",
    "description" : "test description"
}

*/