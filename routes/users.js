var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const Login = require("../models/login");
const bcrypt =  require("bcrypt");
const jwt = require("jsonwebtoken");


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
        token:jwt.sign({email:user.userEmail} , "1234567899787531")
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

router.post("/login",async function(req, res , next) {
  const user = await Login.find({userEmail : req.body.email});
  if(user.length == 0){
    res.status(400).send({status:"NOT OK",error : "Cannot Find User"});
  }else{
    try{
      if(await bcrypt.compare(req.body.password, user[0]._doc.password)){
        const user = {userEmail : req.body.email};
        const accessToken = jwt.sign(user , "1234567899787531");
        res.status(200).send({status:"OK",token : accessToken});
      } else {
        res.status(400).send({status:"NOT OK",error : "Passwords Not Match"});
      }
    }catch(e){
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.send({status:"NOT OK",error : e.message});
    }
  }
});

module.exports = router;
