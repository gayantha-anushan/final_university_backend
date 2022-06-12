const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    notice: {
        type:String,
    }
});

module.exports = mongoose.model("Notification" , NotificationSchema);