var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const Login = require("../models/login");
const Profile = require("../models/Profile");
const Rate = require('../models/rating');
const Report = require('../models/report');
const Sales = require('../models/Sales');
const bcrypt =  require("bcrypt");
const jwt = require("jsonwebtoken");
const AuthFunc = require('../functions/AuthFunc');
const formidable = require('formidable')
const fs = require('fs');
const { SendEmail } = require('../functions/Email');


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
  console.log(req.body)
  var td = AuthFunc.decodeToken(token)
  try {
    console.log(td.uid)
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

router.get('/get-profile/:id', async (req, res) => {
  try {
    var data = await Profile.find({ _id: req.params.id })
    if (data.length == 1) {
      res.status(200).send(data[0]);
    } else {
      res.status(500).send();
    }
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/new-profile',async (req,res)=>{
  const form = formidable({})
  form.parse(req,(err,fields,files)=>{
    if(err){
      console.log(err)
      res.status(500).send(err)
    }else{

      var td = AuthFunc.decodeToken(fields.token);

      var profile = new Profile({
        uid:td.uid,
        firstname:fields.firstname,
        lastname:fields.lastname,
        address:fields.address,
        contact:fields.contact,
        latitude:fields.latitude,
        image:files.image.originalFilename,
        longitude:fields.longitude,
        type:fields.type
      })

      var op = files.image.filepath;
      var np = __dirname + "/profiles/" + files.image.originalFilename
      var rd = fs.readFileSync(op)

      fs.writeFile(np, rd, (erri) => {
        if (erri) {
          console.log(erri)
          res.status(500).send()
        } else {
          profile.save().then((profile)=>{
            res.status(200).send({
              id: profile._id,
              type:profile.type
            })
          }, erry => {
            console.log(erry)
            next(erry)
          });
        }
      })
    }
  })
})

router.post("/update-profile",async (req,res)=>{
  var form = formidable({})
  form.parse(req,async (err,fields,files)=>{
    if(err){
      console.log(err)
      res.status(500).send()
    }else{
      try{
        var verification = AuthFunc.decodeToken(fields.token)
        if(verification.validity == true){
          var rems = await AuthFunc.VerifyTokenWithProfile(fields.token,fields.profile);
          console.log(files)
          console.log(fields)
          if(rems == "VALID"){
            Profile.updateOne({_id:fields.profile},{
              firstname:fields.firstname,
              lastname:fields.lastname,
              image:files.image.originalFilename,
              address:fields.address,
              contact:fields.contact,
              latitude:fields.latitude,
              longitude:fields.longitude,
              type:fields.type
            }).then(()=>{
              var old = files.image.filepath;
              var news = __dirname + "/profiles/"+files.image.originalFilename
              var rawData = fs.readFileSync(old)
              fs.writeFileSync(news,rawData,(err)=>{
                if(err){
                  console.log(err)
                  res.status(500).send()
                }else{
                  console.log("Update Success!")
                  res.status(200).send()
                }
              })
            })
          }
        }
      }catch(error){
        console.log(error)
        res.status(500).send()
      }
    }
  })
})

router.post("/login",async function(req, res , next) {
  console.log(req.body);
  const user = await Login.find({userEmail : req.body.email});
  if(user.length == 0){
    console.log("failed 2")
    res.status(500).send({status:"NOT OK",error : "Cannot Find User"});
  }else{
    try{
      if(await bcrypt.compare(req.body.password, user[0]._doc.password)){
        const userm = {uid:user[0]._id,userEmail : req.body.email};
        const accessToken = jwt.sign(userm , "1234567899787531");
        console.log("success")
        res.status(200).send({status:"OK",token : accessToken});
      } else {
        console.log("failed 1")
        res.status(500).send({status:"NOT OK",error : "Passwords Not Match"});
      }
    }catch(e){
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      console.log("failed 3")
      res.status(500).send({status:"NOT OK",error : e.message});

    }
  }
});

router.post('/verify', async (req, res) => {
  try {
    var resu = await SendEmail("gayanthaanushan.100@gmail.com", "Verifying User", "This is text", "<b>191221</b>");
    res.status(200).send(resu)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/rate' , async (req, res , next) => {
  var result = await Rate.find({});
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json(result);
});

router.get("/rate/:reporteeId" , async (req , res , next) => {
  var result = await Rate.find({"rateeId" : req.params.reporteeId});
  const dataArray = result;
  const arrSize = dataArray.length;
  var commentArray = new Array();
  var totRate = 0;
  dataArray.map(data => {
    totRate += data._doc.rate;
    commentArray.push(data._doc.comment);
  })
  var avgRate = totRate / arrSize;
  const result1 = await Report.find({"reporteeId" : req.params.reporteeId});
  
  if(arrSize == 0){
    avgRate = 0;
  }

  const resultObject = {
    rate : avgRate,
    numberOfReports : result1.length,
    comments : commentArray
  };
  res.json(resultObject);
});

router.post("/createrate", async (req , res , next) => {
  var rate = new Rate({
    rateeId : req.body.rateeId,
    raterId : req.body.raterId,
    rate : req.body.rate,
    comment : req.body.comment
  });

  rate.save()
  .then((rate) => {
    res.json(rate);
  } , error => {
    next(error);
  })
});

router.get('/getdetails' , async (req , res , next) => {
  var users = await Profile.find({});
  var reports = await Report.find({});
  var sales = await Sales.find({});
  res.json({"users" : users.length , "reports" : reports.length , "sales" : sales.length});
});

module.exports = router
