const mongoose = require('mongoose')

const Schema = mongoose.Schema

const messageSchema = new Schema({
    connection: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"connections",
        required:true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Profile",
        required:true
    },
    message: {
        type: String
    },
    timestamps:true
});

module.exports = mongoose.model("messages" , messageSchema);