const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PostSchema = new Schema({
    title:String,
    date:String,
    description:String,
    price:decimal
})

module.exports = mongoose.model("post",PostSchema)