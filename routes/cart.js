var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/new-cart-item' , async (req , res , next) => {
    console.log(req.body.cartItem.json);
});

module.exports = router;