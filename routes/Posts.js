var express = require('express');
var router1 = express.Router();
const bodyParser = require('body-parser');
const Post = require("../models/post");
const fs = require('fs')
// const bcrypt =  require("bcrypt");
// const jwt = require("jsonwebtoken");
const authfunc = require('../functions/AuthFunc');
const formidable = require('formidable');
const mongoose = require('mongoose');

router1.use(bodyParser.json());

router1.get("/" ,(req , res , next) => {
    //{$where:"this.quantity > this.successQuantity"}
    Post.find({}).populate("author").then((result) => {
        return result.filter(item => {
            if (item.quantity > item.successQuantity) {
                return true;
            } else {
                return false;
            }
        })
    }).then((nres) => {
        res.status(200).send(nres);
    }).catch((error) => {
        console.log(error)
        res.status(500).send()
    })
    //res.statusCode = 200;
    //res.setHeader("Content-Type", "application/json");
    //res.json(result);
});

router1.post("/update-post", (req, res) => {
    console.log(req.body);
    Post.findOne({ _id: req.body.id }).then((post_res) => {
        post_res.title = req.body.title;
        post_res.quantity = req.body.quantity;
        post_res.price.wholeseller = req.body.wholeseller;
        post_res.price.localseller = req.body.localseller;
        post_res.price.customer = req.body.customer;
        post_res.description = req.body.description;
        return post_res.save();
    }).then((resu) => {
        console.log(resu)
        res.status(200).send()
    }).catch((error) => {
        console.log(error);
        res.status(500).send();
    })
})

router1.get("/singlepost/:id", (req, res) => {
    Post.find({ _id: req.params.id }).populate("author").then((result) => {
        if (result.length == 1) {
            res.status(200).send(result[0])
        } else {
            res.status(500).send()
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).send()
    })
})

router1.get("/:id" ,async (req , res , next) => {
    var result = await Post.find({author:req.params.id}).populate("author");
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(result);
});

router1.post("/createpost", (req, res, next) => {
    console.log("Requested")

    const form = formidable({});

    form.parse(req,(err,fields,files)=>{
        if(err){
            console.log(err)
        }else{

           // var data = authfunc.decodeToken(fields.token)
            console.log("description :"+fields.description);
            var post = new Post({
                title: fields.title,
                expirity:fields.expirity,
                type:fields.type,
                quantity: fields.quantity,
                description:fields.description,
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

// router1.post('/transaction/:postIs' , async (req, res, next) => {
//     var session = null;

//     mongoose.startSession().then((_session) => {
//         session = _session;
//         session.startTransaction();

//     })
// })

router1.post("/deletepost/:postId",(req, res , next) => {
    Post.deleteOne({ _id: req.params.postId }).then((resu) => {
        res.status(200).send(resu);
    }).catch((error) => {
        console.log(error);
        res.status(500).send();
    })
});



module.exports = router1;

