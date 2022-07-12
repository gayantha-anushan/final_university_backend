const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const stockSchema = new Schema({
    sellerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Profile',
        require: true
    },
    qty : {
        type : Number,
        required : true
    } , 
    date : {
        type : String,
        default : new Date(),
    },
    title : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model("Stock",stockSchema);