var express = require('express');
var router = express.Router();
const Report =  require("../models/report");
const authfunc = require('../functions/AuthFunc');

router.get("/"  ,  async  (req, res ,next) => {
    var result = await Report.find({});
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(result);
 });

 router.post("/createreport" ,authfunc.authenticateTokenNew , async (req, res, next) => {
    var report = new Report({
        author : req.author.userEmail,
        title : req.body.title,
        receiver : req.body.receiver,
        date : req.body.date,
        desctiption : req.body.desctiption
    });

    report.save()
    .then((report) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(report);
    }, err => {
        next(err);
    });

});

router.post("/deletereport/:reportId" , authfunc.authenticateTokenNew , async (req, res, next) =>{
    var report = await Report.findById(req.params.reportId);
    const result = await report.remove();
    res.json(result);
});

module.exports = router;
