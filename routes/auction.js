var express = require('express');
const { VerifyTokenWithProfile } = require('../functions/AuthFunc');
const Bid = require('../models/Bid');
var router = express.Router();

router.post('/bid', (req, res) => {

    console.log(req.body)

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
        res.status(200).send({
            status:"SUCCESS"
        })
    }, (error) => {
        console.log(error);
        res.status(500).send()
    })
})

router.get('/bids/:id', (req, res) => {
    Bid.find({ post: req.params.id }).populate("bidder").then((result) => {
        res.status(200).send(result)
    }, (error) => {
        res.status(500).send(error)
    })
})

//tested successs
router.post('/accept-bid', async (req, res) => {
    var token = req.headers.token;
    var seller = req.headers.profile;
    var verif = await VerifyTokenWithProfile(token, seller)
    if (verif == "VALID") {
        Bid.find({ _id: req.body.bid }).populate('post').then((result) => {
            if (result[0].post.author == seller) {
                Bid.update({ _id: req.body.bid }, { accepted: req.body.acceptance }).then((resp) => {
                    res.status(200).send(resp)
                })
            }
        })
    } else {
        res.status(500).send(verif)
    }
    
})

router.get('/deletebid/:bidid', async (req, res) => {
    //bids can delete buyer before accept the bid
    var token = req.headers.token
    var profile = req.headers.profile
    var resi = await VerifyTokenWithProfile(token, profile);
    if (resi == "VALID") {
        var bid_id = req.params.bid_id;
        var resu = await Bid.find({ _id: bid_id });
        if (resu.length > 0) {
            if (resu[0].accepted == false) {
                Bid.delete({ _id: bid_id }).then((resis) => {
                    res.status(200).send(resis);
                }).catch((error) => {
                    res.status(500).send("Internal Error")
                })
            } else {
                res.status(500).send("Already Accepted")
            }
        } else {
            res.status(500).send("No Results")
        }
    } else {
        res.status(500).send("INVALID")
    }
})


module.exports = router;