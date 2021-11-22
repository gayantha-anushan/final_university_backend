const express = require("express")
const router = express.Router();
var Profile = require('../Schemas/ProfileSchema');
var Login = require('../Schemas/LoginSchema');

 
router.post('/login',(req,res)=>{
    //statement
})

/*

url http://localhost:3000/api/auth/new-usr

tokem {
    "uname":"gayantha",
    "upass":"gayantha"
}
 */

router.post('/new-usr',async (req,res)=>{
    var model = {
        username:req.body.uname,
        password:req.body.upass,
        google_token:null,
    }
    try{
        var result = await Login.insertMany(model);
        console.log(result)
        res.status(200).send()
    }catch(error){
        res.status(500).send()
    }
})

///success and tested
/**
 * required token
 * 
 * {
    "fname":"gayantha",
    "lname":"anushan",
    "add1":"28/1",
    "add2":"Ihalayagoda",
    "add3":"Gampaha",
    "latitude":7.98392378,
    "longitude":10.87897
}

tested url : http://localhost:3000/api/auth/new-profile
 */
router.post('/new-login-google',(req,res)=>{
    var model = {
        username:null,
        password:null,
        google_token:req.body.google_token
    }
    try{
        var result = await Login.insertMany(model);
        res.status(200).send(result[0])
    }catch(error){
        res.status(500).send()
    }
})

router.post('/new-profile',async (req,res)=>{
    //statement
    var model = {
        loginID:req.body.logid,
        firstname:req.body.fname,
        lastname:req.body.lname,
        address:{
            line1:req.body.add1,
            line2:req.body.add2,
            line3:req.body.add3
        },
        geolocation:{
            latitude:req.body.latitude,
            longitude:req.body.longitude
        }
    }
    try{
        var result = await Profile.insertMany(model);
        console.log(result);
        res.status(200).send()
    }catch(error){
        res.status(500).send();
        console.log(error)
    }
})



router.get('/profile/:id',(req,res)=>{
    //statement
})

module.exports = router