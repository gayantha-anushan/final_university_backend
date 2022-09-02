var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const Records = require("../models/record");
const Profile = require("../models/Profile");
const { default: mongoose } = require('mongoose');

router.get("/getrecord", (req, res) => {
    Profile.findOne({ _id: req.body.id }).then((result) => {
        console.log(result);
    })

    
})
module.exports = router;