const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose');

// Another imports goes here

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors())
app.use(express.static(__dirname+'/public'))
app.use(express.static(__dirname+'/images'))

const mongo_url = "mongodb://localhost:27017/application_final";
//const mongo_url = "mongodb+srv://anushan:gaya.kas123@cluster0.5dn9k.mongodb.net/agrosupport?retryWrites=true&w=majority";

mongoose.connect(mongo_url,{
    useUnifiedTopology:true,
    useNewUrlParser:true
})

const connection = mongoose.connection;

connection.once("open",()=>{
    console.log("Mongo DB Connection Established Success!")
})

const authRoute = require('./routes/Authenticate');

app.get('/',(req,res)=>{
    res.send("Successfully Running");
})

app.use('/api/auth',authRoute);

const port = process.env.PORT || 3000
// build application routes

app.listen(port,()=>{
console.log('Server Started!')
})