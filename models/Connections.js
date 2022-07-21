const mongoose = require('mongoose')

const Schema = mongoose.Schema

const connectionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required:true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Profile",
        required:true
    },
    status1: {
        type: String,
        enum: ['Active', 'Blocked', 'Inactive'],
        default:'Active'
    },
    status2: {
        type: String,
        enum: ['Active', 'Blocked', 'Inactive'],
        default:'Active'
    }
});

module.exports = mongoose.model("connections" , connectionSchema);