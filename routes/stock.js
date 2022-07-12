var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const Stock = require('../models/stock');

router.use(bodyParser.json());

router.get('/' , async (req, res, next) => {
    var stocks = await Stock.find({}).populate('buyerId');
    console.log(stocks);
    var date1 = new Date();
    // stocks.map(stock => {
    //     var date2 = new Date(stock._doc.date);
    //     var Difference_In_Time = date1.getTime() - date2.getTime();
  
    //     // To calculate the no. of days between two dates
    //     var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    //     stock.differenceInDays = Difference_In_Days;
    // })

    var array = new Array();
    for(i=0;i<stocks.length;i++) {
        var date2 = new Date(stocks[i]._doc.date);

        var Difference_In_Time = date1.getTime() - date2.getTime();
  
        // To calculate the no. of days between two dates
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        var color;

        if(Difference_In_Days <= 3){
            color = 'green';
        } else if(Difference_In_Days > 3 && Difference_In_Days <= 6){
            color = 'yellow';
        } else if(Difference_In_Days > 6){
            color = 'red';
        }

        array[i] = {
            date : stocks[i]._doc.date,
            _id : stocks[i]._doc._id,
            sellerId : stocks[i]._doc.sellerId,
            qty : stocks[i]._doc.qty,
            title : stocks[i]._doc.title,
            color : color,
        } 
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(array);

})

router.post('/createstock' , async (req, res , next) => {
    var stock = new Stock({
        buyerId : req.body.buyerId,
        sellerId : req.body.sellerId,
        qty : req.body.qty,
        price : req.body.price,
        title : req.body.title
    });

    stock.save()
    .then((stock) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(stock);
    } , err => {
        next(err);
    })
});

router.post('/details' , async (req, res , next) => {
    var date1 = new Date();
    var date2 = new Date(req.body.date);
    var Difference_In_Time = date1.getTime() - date2.getTime();
  
    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    res.json({'count' : Difference_In_Days});
})

module.exports = router;