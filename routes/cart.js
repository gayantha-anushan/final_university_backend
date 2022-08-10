var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const Cart = require('../models/cart');
const Notification = require('../models/Notification');
const Post = require('../models/post');
const { route } = require('.');
const mongoose = require('mongoose');


router.use(bodyParser.json());

router.get('/:buyerId' , async (req, res, next) => {
    var date1 = new Date();
    var cart = await Cart.find({buyerId:req.params.buyerId , isClose : false , isCanceled : false}).populate('postId');
    var array = new Array();
    for(var i=0;i<cart.length;i++) {
        // var date2 = new Date(cart[i]._doc.finalDate);

        var Difference_In_Time = cart[i]._doc.finalDate - date1.getTime();
  
        // To calculate the no. of days between two dates
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        array = array.concat({
            _id : cart[i]._doc._id,
            isApproved : cart[i]._doc.isApproved,
            isCanceled : cart[i]._doc.isCanceled,
            postId : cart[i]._doc.postId,
            buyerId : cart[i]._doc.buyerId,
            sellerId : cart[i]._doc.sellerId,
            price : cart[i]._doc.price,
            qty : cart[i]._doc.qty,
            daysToTransaction : cart[i]._doc.daysToTransaction,
            remainDays : Difference_In_Days,
            isFinish : cart[i]._doc.isFinish
        });
    }
    console.log(array);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(array);
});

router.get('/seller/:sellerId' , async (req, res, next) => {
    var date1 = new Date();
    var orders = await Cart.find({sellerId : req.params.sellerId , isFinish : false , isCanceled : false}).populate('postId').populate('buyerId');
    
    var array = new Array();
    for(var i=0;i<orders.length;i++) {
        var Difference_In_Time = orders[i]._doc.finalDate - date1.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        array = array.concat({
            _id : orders[i]._doc._id,
            isApproved : orders[i]._doc.isApproved,
            isCanceled : orders[i]._doc.isCanceled,
            postId : orders[i]._doc.postId,
            buyerId : orders[i]._doc.buyerId,
            sellerId : orders[i]._doc.sellerId,
            price : orders[i]._doc.price,
            qty : orders[i]._doc.qty,
            daysToTransaction : orders[i]._doc.daysToTransaction,
            remainDays : Difference_In_Days
        });
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(array);
});


router.post('/approvedseller/:cartId' , async (req, res, next) => {
    var cartItem = await Cart.findOneAndUpdate({_id : req.params.cartId} , {isApproved : true , daysToTransaction : req.body.daysToTransaction , finalDate : req.body.finalDate});
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(cartItem);
});

router.post('/finishcartitem/:cartId' , async (req, res , next) => {
    var cartItem = await Cart.findOneAndUpdate({_id : req.params.cartId} , {isFinish : true});
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(cartItem);
});

router.post('/closecartItem/:cartId' , async (req, res, next) => {
    var cartItem = await Cart.findOneAndUpdate({_id : req.params.cartId} , {isClose : true});
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(cartItem);
});

router.post('/cancelcartitem/:cartId' , async (req, res, next) => {
    var session = null;

    mongoose.startSession().then(_session => {
        session = _session;
        session.startTransaction();

        var cartItem = Cart.findOneAndUpdate({_id : req.params.cartId} , {isCanceled : true});
        return cartItem;
    }).then(() => {
        var post = Post.find({_id : req.body.postId});
        console.log(post);
        return Post.updateOne({_id : req.body.postId} , {incompletedQuantity : post._conditions._id.incompletedQuantity - req.body.qty});
    }).then(() => {
        session.commitTransaction();
    }).then(() => {
        session.endSession();
    }).then(() => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({status: "success"});
    }).catch((error) => {
        console.log(error);
        res.status(500).send();
    });
})

router.post('/addtocart' , async (req , res , next) => {
   var cartItem = new Cart({
       postId : req.body.postId,
       buyerId : req.body.buyerId,
       sellerId : req.body.sellerId,
       price : req.body.price,
       qty : req.body.qty
   });

   cartItem.save()
   .then(cartItem => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(cartItem);
   } , err => {
       next(err);
   });

    
});

router.get('/getnotifications/:sellerId' , async (req, res , next) => {
    var notifications = await Notification.find({sellerId : req.params.sellerId}).populate('buyerId');
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(notifications);
})


router.post('/addtonotification' , async (req, res , next) => {
    var notification = new Notification({
        sellerId : req.body.sellerId,
        buyerId : req.body.buyerId,
        transactionType : 'Direct Order',
        cartId : req.body.cartId
    });

    notification.save()
    .then(item => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(item);
    } , err => {
        next(err);
    });
});

router.post('/deletenotification/:id' , async (req, res , next) => {
    var notification =await Notification.findByIdAndRemove({_id : req.params.id});
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(notification);
})

router.post('/removecartitem/:cartItemId' , async (req, res ,next) => {
    var cartItem = await Cart.findByIdAndRemove({_id : req.params.cartItemId});
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(cartItem);


});

module.exports = router;