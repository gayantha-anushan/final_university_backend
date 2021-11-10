const mongoose = require('mongoose')
const Schema = mongoose.Schema
const LoginSchema = new Schema({
    username:String,
    password:String,
    google_token:String,
})

module.exports = mongoose.model("login",LoginSchema)