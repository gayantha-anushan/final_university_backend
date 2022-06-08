const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ratingSchema = new Schema({
    rateeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Profile',
        require : true
    },
    raterId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Profile',
        require : true
    },
    rate : {
        type: Number,
        required : true,
    },
    comment : {
        type : String,
        required : true,
    }
});

module.exports = mongoose.model("Rate" , ratingSchema);

/*

{
    "rateeId" : "628b1e0aed7d940016506aa6",
    "raterId" : "628a847702d8bd0016651327",
    "rate" : 3,
    "comment" : "good but not excellent"
}

*/