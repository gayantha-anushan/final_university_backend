var express = require('express');
var router1 = express.Router();
const bodyParser = require('body-parser');
const Post = require("../models/post");
const fs = require('fs')
// const bcrypt =  require("bcrypt");
// const jwt = require("jsonwebtoken");
const authfunc = require('../functions/AuthFunc');
const formidable = require('formidable')

router1.use(bodyParser.json());

router1.get("/" ,async (req , res , next) => {
    var result = await Post.find({}).populate("author");
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(result);
});

router1.post("/createpost" ,(req , res , next) => {

    const form = formidable({});

    form.parse(req,(err,fields,files)=>{
        if(err){
            console.log(err)
        }else{

           // var data = authfunc.decodeToken(fields.token)

            var post = new Post({
                title : fields.title,
                quantity:fields.quantity,
                author : fields.profile_id,
                date : fields.date,
                //description : fields.description,
                price : {
                    wholeseller:fields.wholeseller,
                    localseller:fields.localseller,
                    customer:fields.customer
                },
                //type : fields.type
                image:files.image.originalFilename
            });
            var oldpath = files.image.filepath;
            var newpath = __dirname + "/uploads/"+files.image.originalFilename;
            var rawData = fs.readFileSync(oldpath)

            fs.writeFile(newpath,rawData,(err)=>{
                if(err){
                    res.status(500).send()
                }else{
                    post.save()
                    .then((post) => {
                        res.status(200).send(post)
                    } , err => {
                        next(err);
                    });
                }
            })

            // fs.writeFile(`${__dirname}/uploads/${imagei.name}`,imagei,()=>{
            //     console.log("Success");
            // })
            // imagei.mv(`${__dirname}/uploads/${imagei.name}`,(err)=>{
            //     console.log(err)
            // })

        }
    })
});

router1.put("/updatepost/:postId",async (req, res , next) => {
    const post = await Post.findById(req.params.postId);
    Object.assign(post, req.body);
    post.save();
    res.json(post);
});

router1.delete("/deletepost/:postId", async (req, res , next) => {
    const post = await Post.findById(req.params.postId);
    const result = await post.remove();
    res.json(result);
});



module.exports = router1;

