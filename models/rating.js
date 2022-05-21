const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ratingSchema = new Schema({
    seller: {
        type: String,
        require : true
    },
    author : {
        type : String,
        required : true,
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
    "seller" : "test seller",
    "author" : "kasun@gmail1.com",
    "rate" : 2,
    "comment" : "good but..."
}

*/