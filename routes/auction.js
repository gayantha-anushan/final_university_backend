var express = require('express');
const Bid = require('../models/Bid');
var router = express.Router();

router.post('/bid', (req, res) => {
    var bid = new Bid({
        post:req.body.post,
        bidder:req.body.bidder,
        amount:req.body.amount,
        quantity:req.body.quantity,
        buy_after:req.body.buy_after,
        value:req.body.value,
        timestamp:req.body.timestamp
    })
    bid.save().then((result) => {
        console.log(result)
        res.status(200).send()
    }, (error) => {
        console.log(error);
        res.status(500).send()
    })
})

router.get('/bids/:id', (req, res) => {
    Bid.find({ post: req.params.post }).then((result) => {
        res.status(200).send(result)
    }, (error) => {
        res.status(500).send(error)
    })
})


module.exports = router;