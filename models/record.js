const mongoose = require('mongoose')
const Schema = mongoose.Schema
const recordSchema = new Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        Ref: "Records",
        require:true
    },
    firstname: String,
    lastname: String,
    image: String,

    time: {
        type:String,
    },
    amount: {
        type: String,
        require: true,
        
    },

});
module.exports = mongoose.model("Records", recordSchema);