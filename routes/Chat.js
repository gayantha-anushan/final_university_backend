var express = require('express');
var router = express.Router();

router.get('/connections/:id', (req, res) => {
    //Get All Connections for user
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