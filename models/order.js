const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    qty : {
        type : Number,
        required : true
    },
    date : {
        type : String,
        required : true
    },
    
});

module.exports = mongoose.model("Login" , orderSchema);