var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const Sales = require('../models/Sales');
const Profile = require('../models/Profile');
const Post = require('../models/post');
const { default: mongoose } = require('mongoose');


router.use(bodyParser.json());

router.get('/' , async (req, res , next) => {
    var sales = await Sales.find({});
    console.log(sales[0]._doc.date.split(' ')[1]);

    var month = [0,0,0,0,0,0,0,0,0,0,0,0];

    sales.map(sale => {
        if(sale._doc.date.split(' ')[1] == 'Jan'){
            month[0]++;
        } else if(sale._doc.date.split(' ')[1] == 'Feb'){
            month[1]++;
        } else if(sale._doc.date.split(' ')[1] == 'Mar'){
            month[2]++;
        } else if(sale._doc.date.split(' ')[1] == 'Apr'){
            month[3]++;
        } else if(sale._doc.date.split(' ')[1] == 'May'){
            month[4]++;
        } else if(sale._doc.date.split(' ')[1] == 'Jun'){
            month[5]++;
        } else if(sale._doc.date.split(' ')[1] == 'Jul'){
            month[6]++;
        } else if(sale._doc.date.split(' ')[1] == 'Aug'){
            month[7]++;
        } else if(sale._doc.date.split(' ')[1] == 'Sep'){
            month[8]++;
        } else if(sale._doc.date.split(' ')[1] == 'Oct'){
            month[9]++;
        } else if(sale._doc.date.split(' ')[1] == 'Nov'){
            month[10]++;
        } else if(sale._doc.date.split(' ')[1] == 'Dec'){
            month[11]++;
        }
    });

    res.json({'sales' : month});
});

router.get('/successsales/:id' , async (req , res , next) => {
    var successSales = await Sales.find({isSuccessful : true , sellerId : req.params.id}).distinct("buyerId");
    var contacts = await Profile.find({_id : successSales});
    res.json(contacts);
});

router.get('/successsales/sellercontact/:id' , async  (req, res , next) => {
    var successSales = await Sales.find({isSuccessful : true , buyerId : req.params.id}).distinct("sellerId");
    var contacts = await Profile.find({_id : successSales});
    res.json(contacts);
});

router.post('/createsale' , async (req, res , next) => {
    
    var session = null;

    mongoose.startSession().then(_session => {
        session = _session;
        session.startTransaction();

        var sale = new Sales({
            cartId : req.body.cartId,
            sellerId : req.body.sellerId,
            buyerId : req.body.buyerId,
            isSuccessful : req.body.isSuccessful
        });

        return sale.save();
    }).then(() => {
        var incomplete = Post.find({_id : req.body.postId});
        return Post.updateOne({_id : req.body.postId} , {incompletedQuantity : req.body.qty+incomplete._conditions._id.incompletedQuantity});
    }).then(() => {
        session.commitTransaction();
    }).then(() => {
        session.endSession();
    }).then(() => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({status: "success"});
    }).catch((error) => {
        console.log(error)
        res.status(500).send()
    });
});

router.post('/updatesale/:cartId' , async(req, res , next) => {

    var session = null;

    mongoose.startSession().then(_session => {
        session = _session;
        session.startTransaction();

        var sale =  Sales.findOneAndUpdate({cartId : req.params.cartId} , {isSuccessful : true});
        return sale;
    }).then(() => {
        var post = Post.find({_id : req.body.postId});
        return Post.updateOne({_id : req.body.postId} , {incompletedQuantity : post._conditions._id.incompletedQuantity - req.body.qty , successQuantity : post._conditions._id.successQuantity+req.body.qty});
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
});


module.exports = router;

/**
 
    {
    "cartId" : "628a85e502d8bd0016651328",
    "buyerId" : "628a847702d8bd0016651327",
    "sellerId" : "628b1e0aed7d940016506aa6",
    "date": "Sat Jun 04 2022 11:51:52 GMT+0530 (India Standard Time)"
    }

 */