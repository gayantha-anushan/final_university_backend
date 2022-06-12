var express = require('express');
var router = express.Router();
var Notification = require('../models/Notification');

router.get("/all/:user", (req, res) => {
    //getting all notifications
})

router.get("/temp", async(req, res) => {
    var nt = await Notification.create({
        notice:"Temporary notification created!"
    })
    var resu = await nt.save({ timestamps: true })
    res.status(200).send(resu.createdAt)
})

module.exports = router;