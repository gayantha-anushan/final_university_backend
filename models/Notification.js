const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    cartId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Cart',
        require: true
    },
    sellerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Profile',
        require: true
    },
    buyerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Profile',
        require: true
    },
    transactionType : {
        type : String,
        required : true,
    },
    date : {
        type : String,
        default : new Date(),
    },
    markAsRead : {
        type : Boolean,
        default : false,
    }
});

module.exports = mongoose.model("Notification" , NotificationSchema);