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
    google_token : {
        type : String
    }
});

module.exports = mongoose.model("Login" , loginSchema);

