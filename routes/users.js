var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const Login = require("../models/login");
const Profile = require("../models/Profile")
const bcrypt =  require("bcrypt");
const jwt = require("jsonwebtoken");
const AuthFunc = require('../functions/AuthFunc');


router.use(bodyParser.json());

/* GET users listing. */
// router.get('/',async (req, res, next) =>  {
//   // Login.find({})
//   // .then(users => {  
//   //   res.statusCode = 200;
//   //   res.setHeader("Content-Type", "application/json");
//   //   res.json(users);
//   // });

//   var result = await Login.find({});
//   console.log(result);
//   res.statusCode = 200;
//   res.setHeader("Content-Type", "application/json");
//   res.json(result);
// });

router.post('/signup',async (req, res, next) => {

  try{
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password , salt);
    var user = new Login({
      userEmail : req.body.email,
      password : hashedPassword
    });

    // Login.create can also use

    user.save()
    .then((user) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        status:"OK",
        token:jwt.sign({uid:user._id,email:user.userEmail} , "1234567899787531")
      });
    } , err => {
      next(err);
    });
  }catch(e){
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.send("error");
  }
});

router.post('/profile-data',async (req,res)=>{
  var token = req.body.token;
  var td = AuthFunc.decodeToken(token)
  try{
    var data = await Profile.find({uid:td.uid})
    if(data.length == 0){
      res.status(200).send({
        status:"ERROR"
      })
    }else{
      res.status(200).send({
        status:"OK",
        data:data[0]
      });
    }
  }catch(error){
    res.status(200).send(error);
  }
})

router.post('/new-profile',async (req,res)=>{
  var td = AuthFunc.decodeToken(req.body.token)
  try{
    var profile = new Profile({
      uid:td.uid,
      firstname:req.body.firstname,
      lastname:req.body.lastname,
      address:req.body.address,
      contact:req.body.contact,
      latitude:req.body.latitude,
      longitude:req.body.longitude,
      type:req.body.type
    })
    profile.save().then((profile)=>{
      res.status(200).send({
        id:profile._id
      })
    },err=>{
      res.status(500).send(err);
    });
  }catch(error){
    res.status(500).send(error);
  }
})

router.post("/update-profile",async (req,res)=>{
  try{
    console.log(req.body)
    var verification = AuthFunc.decodeToken(req.body.token)
    if(verification.validity == true){
      var rems =await AuthFunc.VerifyTokenWithProfile(req.body.token,req.body.profile);
      if(rems == "VALID"){
        await Profile.updateOne({_id:req.body.profile},{
          firstname:req.body.firstname,
          lastname:req.body.lastname,
          address:req.body.address,
          contact:req.body.contact,
          latitude:req.body.latitude,
          longitude:req.body.longitude,
          type:req.body.type
        })
      }
    }
    console.log("Update Success!")
    res.status(200).send()
  }catch(error){
    console.log("Failed to update")
    res.status(500).send()
  }
})

router.post("/login",async function(req, res , next) {
  console.log(req.body);
  const user = await Login.find({userEmail : req.body.email});
  if(user.length == 0){
    console.log("failed 2")
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

module.exports = router;
