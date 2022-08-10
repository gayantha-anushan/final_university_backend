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

router.post('/new_connection', (req, res) => {
    //Create new connection
})

router.post('/accept', (req, res) => {
    //Accept Connection
})

router.post('/new_message', (req, res) => {
    //create new message
})

module.exports = router;