var express = require('express');
const { VerifyTokenWithProfile } = require('../functions/AuthFunc');
const Bid = require('../models/Bid');
const Post = require('../models/post')
var router = express.Router();
const mongoose = require('mongoose');
const { db } = require('../models/post');
const Notification = require('../models/Notification');

router.post('/bid', async (req, res) => {

    let session = null;
    var author = req.body.author;
    mongoose.startSession().then((_session) => {
        session = _session;
        session.startTransaction();
        var bid = new Bid({
            post:req.body.post,
            bidder:req.body.bidder,
            amount:req.body.amount,
            quantity:req.body.quantity,
            buy_after:req.body.buy_after,
            value:req.body.value,
            timestamp:req.body.timestamp
        })

    // bid.save().then(() => {
    //     res.status(200).send({
    //         status:"SUCCESS"
    //     })
    // }).catch((error) => {
    //     res.status(500).send();
    // })

        return bid.save()
    }).then((rs) => {
        console.log(rs)
        var notification = new Notification({
            sellerId: author,
            buyerId: req.body.bidder,
            transactionType: "Bid",
            date: new Date(),
        })
        return notification.save();
    //     return Post.updateOne({_id:req.body.post},{incompletedQuantity:req.body.quantity})
    }).then(() => session.commitTransaction())
        .then(() => session.endSession()).then(() => {
        res.status(200).send({
            status:"SUCCESS"
        })
    }).catch((error) => {
        console.log(error)
        res.status(500).send()
    })
})

router.get('/post-and-bid/:id',async  (req, res) => {
    try {
        var resu = await Post.findOne({ _id: req.params.id});
        var did = await Bid.find({ post: resu._id }).populate("bidder")
        const newArray = {
            post: resu,
            bids:did
        }
        res.status(200).send(newArray);      
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
})

router.get('/find-bidded-posts/:id',async  (req, res) => {
    try {
        var verification =await VerifyTokenWithProfile(req.headers.token, req.params.id);
        if (verification == "VALID") {
            var resu = await Post.find({ author: req.params.id,type:"Auction" });
            var newArray = [];
            for (var i = 0; i < resu.length; i++){
                var did = await Bid.find({ post: resu[i]._id })
                newArray = newArray.concat({
                    post: resu[i],
                    bids:did.length
                })
            }
            res.status(200).send(newArray);
        } else {
            console.log("Invalid sent : "+req.headers.token + ' : '+req.params.id)
            res.status(500).send(verification);
        }       
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/bids/:id', (req, res) => {
    Bid.find({ post: req.params.id }).populate("bidder").then((result) => {
        res.status(200).send(result)
    }, (error) => {
        res.status(500).send(error)
    })
})

router.get('/bidder-bids/:id', (req, res) => {
    Bid.find({ bidder: req.params.id }).populate("post").then((result) => {
        res.status(200).send(result)
        console.log(result)
    }, (error) => {
        res.status(500).send(error)
    })
})

//tested successs
router.post('/accept-bid', async (req, res) => {
    var token = req.headers.token;
    var seller = req.headers.profile;
    var bidQuantity = 0;
    var posti = null;
    var previous = false;
    var session = null;
    mongoose.startSession().then(_session => {
        session = _session;
        session.startTransaction();

        return VerifyTokenWithProfile(token, seller)
    }).then((verif) => {
        if (verif == "VALID") {
           return Bid.find({_id:req.body.bid}).populate('post')
        } else {
            throw new Error("Invalid Authentication");
        }
    }).then((result) => {
        if (result[0].post.author == seller) {
            bidQuantity = result[0].quantity;
            previous = result[0].accepted;
            posti = result[0].post._id;
            return Bid.updateOne({ _id: req.body.bid }, { accepted: req.body.acceptance })
        } else {
            throw new Error("Requested user is not Seller!")
        }
    }).then(async (resultd) => {
        if (previous != req.body.acceptance) {
            var post = await Post.findOne({ _id: posti })
            if (req.body.acceptance == true) {
                //post.successQuantity = post.successQuantity + bidQuantity;
                post.incompletedQuantity = post.incompletedQuantity + bidQuantity;
            } else {
                //post.successQuantity = post.successQuantity - bidQuantity;
                post.incompletedQuantity = post.incompletedQuantity - bidQuantity;
            }
            return post.save()
        } else {
            throw new Error("Not Changed")
        }
    }).then(() => session.commitTransaction()).then(() => session.endSession()).then(() => {
        res.status(200).send({
            data:true
        })
    }).catch((error) => {
        console.log(error)
        res.status(500).send({
            data:false
        })
    })
})

router.get('/complete-bid', async (req, res) => {
    var token = req.headers.token
    var profile = req.headers.profile
    var bid = req.headers.bid
    var session = null;
    var postid = null;
    var qty = 0;
    mongoose.startSession().then(_session => {
        session = _session;
        session.startTransaction();

        return VerifyTokenWithProfile(token, profile);
    }).then((v) => {
        if (v == "VALID") {
            console.log("Success")
            return Bid.findOne({ _id: bid }).populate("post");
        } else {
            res.status(500).send()//TODO : Throw weeoe
        }
    }).then((bd) => {
        if (bd.accepted == true && bd.post.author == profile) {
            bd.completed = true;
            postid = bd.post._id;
            qty = bd.quantity
            return bd.save();
        } else {
            res.status(500).send()//TODO : Throw error
        }
    }).then(async () => {
        //console.log("postid : "+postid)
        var post = await Post.findOne({ _id: postid });
        post.incompletedQuantity = post.incompletedQuantity - qty;
        post.successQuantity = post.successQuantity + qty;
        return post.save();
        //return Post.updateOne({_id:postid},{incompletedQuantity:incompletedQuantity - qty,successQuantity:successQuantity + qty})
    }).then((res) => {
        return session.commitTransaction()
    }).then(() => session.endSession()).then(() => {
        res.status(200).send()
    }).catch((error) => {
        console.log(error);
        res.status(500).send()
    })
})

router.get('/deletebid/:bidid', async (req, res) => {

    let session = null;
    var token = req.headers.token
    var profile = req.headers.profile
    var bid_id = req.params.bidid;
    var postid = null;
    var quantity = 0;

    mongoose.startSession().then(_session => {
        session = _session
        session.startTransaction();
        return VerifyTokenWithProfile(token, profile)
    }).then((result) => {
        if (result == "VALID") {
            return Bid.find({ _id: bid_id });
        } else {
            throw new Error("Invalid Authentication");
        }
    }).then((resu) => {
        if (resu.length > 0) {
            if (resu[0].accepted == false) {
                postid = resu[0].post
                quantity = resu[0].quantity;
                return Bid.deleteOne({_id:bid_id})
            } else {
                throw new Error("Already Accepted!")
            }
        } else {
            throw new Error("Invalid results")
        }
    }).then(async () => {
        const doc = await Post.findOne({ _id: postid });
        doc.incompletedQuantity = doc.incompletedQuantity - quantity;
        return doc.save();
    }).then(() => session.commitTransaction())
        .then(() => session.endSession()).then(() => {
            res.status(200).send();
        }).catch((error) => {
            console.log(error);
            res.status(500).send();
    })
})


module.exports = router;