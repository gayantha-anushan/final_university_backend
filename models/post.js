const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PostSchema = new Schema({
    // need user id as reference
    title:{
        type : String,
        required : true,
    },
    author : {
        type : String,
    },
    date:{
        type : String,
        required : true,
    },
    description:String,
    price:String,
    type : {
        type : String,
        required : true,
    }
})

module.exports = mongoose.model("Post",PostSchema);

// {
//     "title": "carrot",
//     "date": "2022-01-03",
//     "description" : "new vegy",
//     "price" : "23",
//     "type" : "auction",
//     "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ3cXdlcWUiLCJpYXQiOjE2NTE4MjUzOTZ9.2D3dLQ_88M5ChlKJZMEzWObsMOyE_i6eH4lrSxHkYgY",
//     "author" : "www"
//   }

// {
//     "email" : "wqweqe",
//     "password" : "kasun"
// }