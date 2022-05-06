var express = require('express');
var router1 = express.Router();
const bodyParser = require('body-parser');
const Post = require("../models/post");
// const bcrypt =  require("bcrypt");
// const jwt = require("jsonwebtoken");
const authfunc = require('../functions/authFunc');

router1.use(bodyParser.json());
console.log("in");

router1.get("/" ,async (req , res , next) => {
    var result = await Post.find({});
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(result);
});

router1.post("/createpost" , (req , res , next) => {

    var decdata = authfunc.decodeToken(req.body.token);

    if(decdata.validity){
        var email = decdata.email;
        var post = new Post({
            title : req.body.title,
            author : email,
            date : req.body.date,
            description : decdata.description,
            price : req.body.price,
            type : req.body.type
        });
        console.log(decdata.email);
        post.save()
        .then((post) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(post);
        } , err => {
          next(err);
        });
    }

    
});



module.exports = router1;

