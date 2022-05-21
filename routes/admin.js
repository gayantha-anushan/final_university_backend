var express = require('express');
var router = express.Router();
const Admin = require("../models/admin");
const authfunc = require('../functions/authFunc');

router.post("/" ,authfunc.authenticateTokenNew ,async (req, res , next) => {
    var result = await Admin.findOne({ adminEmail : req.author.userEmail});
    if(result != null){
        var out = await Admin.find({});
        res.json(out);
    } else {
        res.send("You Don't Have Previled");
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