const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loginSchema = new Schema({
    userEmail: {
        type : String,
        unique : true,
        required : true,
        dropDups : true,
    },
    password: {
        type : String,
    },
    isActive : {
        type: Boolean,
        default : false,
    },
    isAdmin : {
        type : Boolean,
        default : false
    }
});

module.exports = mongoose.model("Login" , loginSchema);

