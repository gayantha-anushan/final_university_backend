const mongoose = require('mongoose')
const Schema = mongoose.Schema
const LoginSchema = new Schema({
    useremail:{
        type:String,
        unique:true,
        required:true,
        dropDups:true
    },
    password:{
        type:String,
        required:true
    },
    //google_token:String,
})

module.exports = mongoose.model("login",LoginSchema)