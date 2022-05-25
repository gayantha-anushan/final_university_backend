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
    },
    amount: {
        type: Number,
        require:true
    }
});

module.exports = mongoose.model("Bid" , BidSchema);