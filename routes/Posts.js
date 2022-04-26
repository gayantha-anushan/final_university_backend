const express = require("express")
const router = express.Router();
const PostSchema = require("../Schemas/PostSchema")
const logger =  require("logger").createLogger(__dirname+"/datalog.txt")

router.post('/new-post',(req,res)=>{
    try{
        var model = {
            title:req.body.title,
            date:req.body.date,
            description:req.body.description,
            price:req.body.price
        }
        var result = await PostSchema.insertMany(model)
        console.log(result);
    }catch(error){
        res.status(500).send()
        console.log(error);
        logger.error(error)
    }
})

router.get("/all-posts",(req,res)=>{
    try{
        var result = await PostSchema.find()
        res.status(200).send()
    }catch(error){
        res.status(500).send()
        console.log(error)
        logger.error(error)
    }
})