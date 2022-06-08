const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const saleSchema = new Schema({
    cartId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Cart",
        required : true
    },
    sellerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Profile",
        required : true
    },
    buyerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Profile",
        required : true
    },
    date : {
        type : String,
        default : new Date(),
    },
    isSuccessful : {
        type : Boolean,
        default : false
    }
});

module.exports = mongoose.model("Sale" , saleSchema);

