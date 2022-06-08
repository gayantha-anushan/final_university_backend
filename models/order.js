const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    buyerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Profile",
        required : true
    },
    cartId : {

    },
    qty : {
        type : Number,
        required : true
    },
    date : {
        type : String,
        required : true
    },
    
});

module.exports = mongoose.model("Order" , orderSchema);