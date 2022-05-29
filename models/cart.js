const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    postId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post",
        required : true
    },
    buyerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Profile',
        require: true
    },
    sellerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Profile',
        require: true
    },
    price : {
        type : Number
    },
    qty : {
        type : Number,
        required : true
    },
    isApproved : {
        type : Boolean,
        default : false
    }
});

module.exports = mongoose.model("Cart",cartSchema);