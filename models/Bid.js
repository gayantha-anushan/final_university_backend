const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BidSchema = new Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref:"Post"
    },
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref:"Profile"
    },//bidded total amount
    amount: {
        type: Number,
        require:true
    },
    quantity: {
        type: Number,
        require:true
    },
    buy_after: {
        type:Number
    },//value of minimum bid amount
    value: {
        type: Number,
        require:true,
    },
    timestamp: {
        type: Date,
        require:true
    },
    accepted: {
        type: Boolean,
        require: true,
        default:false
    }
});

module.exports = mongoose.model("Bid" , BidSchema);