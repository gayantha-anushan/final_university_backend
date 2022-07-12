var express = require('express');
var router = express.Router();
const Report =  require("../models/report");
const authfunc = require('../functions/AuthFunc');

router.get("/"  ,  async  (req, res ,next) => {
    var result = await Report.find({}).populate('reporterId').populate('reporteeId');
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(result);
 });

 router.post("/createreport" ,async (req, res, next) => {
    var report = new Report({
        reporterId : req.body.reporterId,
        reporteeId : req.body.reporteeId,
        title : req.body.title,
        description : req.body.description
    });

    report.save()
    .then(report => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(report);
    } , err => {
        next(err);
    });

});

router.post("/deletereport/:reportId" , async (req, res, next) =>{
    var report = await Report.findByIdAndRemove({_id : req.params.reportId});
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(report);
});

module.exports = router;
