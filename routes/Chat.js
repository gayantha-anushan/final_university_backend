var express = require('express');
const Connections = require('../models/Connections');
var router = express.Router();

router.get('/connections/:id', async (req, res) => {
    //Get All Connections for use
    try {
        var connections = await Connections.find({ $or: [{ "user": req.params.id }, { "user2": req.params.id }] }).populate("user").populate("user2")
        res.status(200).send(connections)
    } catch (ex) {
        res.status(500).send()
    }
})


router.post('/new_connection', async (req, res) => {
    //Create new connection
    try {
        var connections = await Connections.find({$or: [{ $and:[{ "user": req.body.user }, { "user2": req.body.user2 }]},{$and:[{"user":req.body.user2},{"user2":req.body.user}]}]
        }).populate("user").populate("user2")
        if (connections.length == 0) {
            var conn = new Connections({
                user:req.body.user,
                user2:req.body.user2,
                status1:"Active",
                status2:"Active"
            })
            var resu = await conn.save()
            console.log(resu);
            res.status(200).send({
                id:resu._id
            })
        } else {
            res.status(200).send({
                id:connections[0]._id
            })
        }
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/accept', (req, res) => {
    //Accept Connection
})

router.post('/new_message', (req, res) => {
    //create new message
})

module.exports = router;