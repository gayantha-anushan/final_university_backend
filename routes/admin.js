var express = require('express');
var router = express.Router();
const Admin = require("../models/admin");
const authfunc = require('../functions/authFunc');
const Login = require('../models/login');
const bcrypt =  require("bcrypt");
const jwt = require("jsonwebtoken");



router.post("/" ,authfunc.authenticateTokenNew ,async (req, res , next) => {
    var result = await Admin.findOne({ adminEmail : req.author.userEmail});
    if(result != null){
        var out = await Admin.find({});
        res.json(out);
    } else {
        res.send("You Don't Have Previled");
    }
});

router.post('/loginadmin' , async (req, res , next) => {
    const user = await Login.find({userEmail : req.body.email});
    if(user.length == 0){
        console.log("failed 2");
        res.status(400).send({status:"NOT OK",error : "Cannot Find User"});
      }else{
        try{
          if(await bcrypt.compare(req.body.password, user[0]._doc.password)){
            const userm = {uid:user[0]._id,userEmail : req.body.email};
            const accessToken = jwt.sign(userm , "1234567899787531");
            console.log("success")
            res.status(200).send({status:"OK",token : accessToken});
          } else {
            console.log("failed 1")
            res.status(400).send({status:"NOT OK",error : "Passwords Not Match"});
          }
        }catch(e){
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          console.log("failed 3")
          res.send({status:"NOT OK",error : e.message});
    
        }
      }
});

router.post("/createadmin" , authfunc.authenticateTokenNew , async (req , res , next) => {
    var result = await Admin.findOne({ adminEmail : req.author.userEmail});
    if(result != null){
        var admin =  new Admin({
            adminEmail : req.body.adminEmail
        });

        admin.save()
        .then((admin) => {
            res.json(admin);
        });
    } else {
        res.send("You Don't Have Previled");
    }
});

router.post("/deleteadmin" ,authfunc.authenticateTokenNew , async (req , res , next) => {

    var result = await Admin.findOne({adminEmail : req.author.userEmail});
    if(result != null){
        var admin = await Admin.findOne({adminEmail : req.body.adminEmail});
        var out = await admin.remove();
        res.json(out);
    } else {
        res.send("You Don't Have Previled");
    }

});

module.exports = router;