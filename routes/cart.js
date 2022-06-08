var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const Cart = require('../models/cart');


router.use(bodyParser.json());

router.get('/' , async (req, res, next) => {
    var cart = await Cart.find({}).populate('buyerId').populate('sellerId');
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(cart);
});

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
   })
});

router.post('/removecartitem/:cartItemId' , async (req, res ,next) => {
    var cartItem = await Cart.findByIdAndRemove({_id : req.params.cartItemId});
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(cartItem);
});

module.exports = router;