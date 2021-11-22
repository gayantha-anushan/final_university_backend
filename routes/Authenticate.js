const express = require("express")
const router = express.Router();
var Profile = require('../Schemas/ProfileSchema');
var Login = require('../Schemas/LoginSchema');
const jwt = require('jsonwebtoken');

const authfunc = require('../functions/AuthFunc')
const Security = require('../functions/Security')
 

//success and tested
router.post('/login',async (req,res)=>{
    try{
        var result = await Login.find({
            useremail:req.body.uemail,
            password:Security.encrypt(req.body.upass)
        });
        if(result.length == 1){
            const token = jwt.sign({
                email:result.useremail
            },authfunc.secretKey());
            res.status(200).send({
                status:"OK",
                token:token
            })
        }else{
            res.status(200).send({
                status:"FAIL",
                error:{
                    code:1,
                    message:"User Not Found"
                }
            })
        }
    }catch(error){
        res.status(500).send(error)
    }
})

//success and token received
router.post('/new-usr',async (req,res)=>{
    var model = {
        useremail:req.body.uemail,
        password:Security.encrypt(req.body.upass),
        google_token:null,
    }
    try{
        var result = await Login.insertMany(model);
        console.log(result)
        var token = jwt.sign({
            email:req.body.uemail
        },authfunc.secretKey())
        res.status(200).send({
            status:"OK",
            token:token
        })
    }catch(error){
        res.status(500).send()
    }
})

//success and tested
router.post('/login-google',async (req,res)=>{
    var model = {
        useremail:req.body.google_mail,
        password:null,
        google_token:req.body.google_token
    }
    try{
        var result = await Login.find({google_token:req.body.google_token});
        if(result.length == 0){
            await Login.insertMany(model)
            var token = jwt.sign({
                email:req.body.google_mail
            },authfunc.secretKey());
            res.status(200).send({profiled:false,token:token});
        }else{
            var token = jwt.sign({
                email:req.body.google_mail
            },authfunc.secretKey());
            res.status(200).send({profiled:true,token:token});
        }
    }catch(error){
        res.status(500).send(error)
    }
})

//need to test when uploading
router.post('/new-profile',async (req,res)=>{
    const myfile = req.files.image;
    var decdata = authfunc.decodeToken(req.body.token);
    if(decdata.validity){
        try{
            myfile.mv(`${__dirname}/images/profile/${myFile.name}`)
            var resu = await Login.findOne({useremail:decdata.email})
            var logid = resu._id;
            var model = {
                loginID:logid,
                pictureURL:myFile.name,
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
            var result = await Profile.insertMany(model);
            res.status(200).send(result)
        }catch(error){
            console.log(error)
            res.status(500).send({
                message:"Insertion Error"
            })
        }
    }else{
        res.status(500).send({
            error:"Could not verify token"
        })
    }
})
//success and tested
router.post('/profile-data',async (req,res)=>{
    var decodedToken = authfunc.decodeToken(req.body.token);
    if(decodedToken.validity){
        var result = await Login.findOne({useremail:decodedToken.email});
        var login_id = result._id;
        var profile_data = await Profile.findOne({loginID:login_id});
        res.status(200).send(profile_data);
    }else{
        res.status(500).send({
            error:"Could not verify token"
        })
    }
})

module.exports = router