var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const Sales = require('../models/Sales');


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

router.post('/createsale' , async (req, res , next) => {
    var sale = new Sales({
        cartId : req.body.cartId,
        sellerId : req.body.sellerId,
        buyerId : req.body.buyerId,
        isSuccessful : req.body.isSuccessful
    });

    sale.save()
    .then(sale => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(sale);
    } , err => {
        next(err);
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