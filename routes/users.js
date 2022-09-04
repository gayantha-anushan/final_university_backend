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
const NodeMailer = require('nodemailer');
var SibApiV3Sdk = require('sib-api-v3-sdk');


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
      const email = req.body.email;
      const JWT_SECRET = 'gayanthahora';

      const payLoad = {
        email : email
      }
  

      // todo gayantha change URL
      const token = jwt.sign(payLoad , JWT_SECRET , {expiresIn: '15m'});
      const link = `http://localhost:3001/api/auth/verifyemail/${token}`;

      const transporter = NodeMailer.createTransport({
        service: 'SendinBlue', // no need to set host or port etc.
        auth: {
            user: 'govisaviya.official@gmail.com',
            pass: 's3a8AbGSL9zQYJjK'
        }
      });

      transporter.sendMail({
        to: `${email}`,
        from: 'govisaviya.official@gmail.com',
        subject: 'Please Verify the Email',
        html: `<h1>Click Here to Verify</h1>
              <a href="${link}"><button>Verify</button>`
      }).then((response) => {
        console.log("Successfully sent");
      })
      .catch((err) => console.log("Failed ", err));


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

router.get('/verifyemail/:token' , async (req , res , next) => {
  const JWT_SECRET = 'gayanthahora';
  var token = req.params.token;
  const decode = jwt.verify(token, JWT_SECRET);

  console.log(decode.email);

  const response = await Login.findOneAndUpdate({userEmail : decode.email} , {isActive : true});

  res.send('Email Verified!!');

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
});

router.post('/new-profile',async (req,res)=>{
  const form = formidable({})
  
  

  form.parse(req, async (err,fields,files)=>{
    if(err){
      console.log(err)
      res.status(500).send(err)
    } else {
      
      var td = AuthFunc.decodeToken(fields.token);

      const status = await Login.findById({_id : td.uid});

      console.log(status.isActive);


      if(status.isActive == true){
        Profile.find({ uid: td.uid }).then((resultp) => {
          if (resultp.length > 0) {
            res.status(500).send();
          } else {
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
                    type:profile.type,
                    isActive : true,
                  })
                }, erry => {
                  console.log(erry)
                  next(erry)
                });
              }
            })
          }
        }).catch((error) => {
          console.log(error);
          res.status(500).send();
        })
      } else {
        res.json({'isActive' : false});
      }   
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
    console.log(req.body.email)
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

router.post('/enteremail' , async function (req, res , next) {
  var user = await Login.findOne({userEmail : req.body.userEmail});
  console.log(user);
  if(user !== null){

    const JWT_SECRET = '123654890321890765';

    const payLoad = {
      email : user.userEmail,
      id : user._id
    }

    const token = jwt.sign(payLoad , JWT_SECRET , {expiresIn: '15m'});

    // todo gayantha change URL
    const link = `http://localhost:3000/changepassword/${user._id}/${token}`

    const transporter = NodeMailer.createTransport({
      service: 'SendinBlue', // no need to set host or port etc.
      auth: {
          user: 'govisaviya.official@gmail.com',
          pass: 's3a8AbGSL9zQYJjK'
      }
    });
  
    transporter.sendMail({
      to: `${req.body.userEmail}`,
      from: 'govisaviya.official@gmail.com',
      subject: 'Forgot Password',
      html: `<h1>Click Here to Change the Password</h1>
            <a href="${link}"><button>Change Password</button>`
    }).then((response) => {
      console.log("Successfully sent");
      res.json({'status' : 'okay'});
    })
    .catch((err) => console.log("Failed ", err));
  } else {
    res.json({'status' : 'fail'});
  }
})

router.post('/changepassword' , async (req, res , next) => {

  const {id , token , password} = req.body;
  const JWT_SECRET = '123654890321890765';
  const decode = jwt.verify(token, JWT_SECRET);
  
  if(decode.id == id){
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password , salt);
    var result = await Login.findOneAndUpdate({_id : id} , {password : hashedPassword});
    console.log(result);
    res.json({'status' : 'okay'});
  } else {
    res.json({'status' : 'fail'});
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

router.get('/gettypes' ,async (req, res , next) => {

  var array =  new Array();
  var farmers = await Profile.find({'type' : 'farmer'});
  var wholesellers = await Profile.find({'type' : 'wholeseller'});
  var localsellers = await Profile.find({'type' : 'localseller'});
  var customers = await Profile.find({'type' : 'customer'});
  array[0] = farmers.length;
  array[1] = wholesellers.length;
  array[2] = localsellers.length;
  array[3] = customers.length;
  res.json(array);

});


module.exports = router
