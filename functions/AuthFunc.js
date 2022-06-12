const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");

function secretKey(){
    return "1234567899787531"
}

function decodeToken(token){ 
    try{
        const decoded = jwt.verify(token,secretKey())
        const email = decoded.userEmail;
        const uid = decoded.uid;
        return {
            validity:true,
            email:email,
            uid:uid
        }
    }catch(error){
        console.log(error)
        return {
            validity:false,
            error:error
        }
    }
}

async function VerifyTokenWithProfile(token,profile){
        var token = decodeToken(token);
        var data =await Profile.find({_id:profile});
        if(data.length == 1){
            if(token.validity){
                if(token.uid == data[0].uid){
                    return "VALID"
                }else{
                    return "INVALID 1"
                }
            }else{
                return "INVALID 2"
            }
        }else{
            return "INVALID 3"
        }
}

function authenticateTokenNew(req , res , next) {
    // const authHeader = req.headers["authorization"];
    // const token = authHeader && authHeader.split(" ")[1];
    const token = req.headers.jwt;
    if(token == null){
        return res.sendStatus(401);
    }

    jwt.verify(token, secretKey() , (err , email) => {
        if(err) return res.sendStatus(403);
        req.author = email;
        next();
    }) 
}

module.exports = {secretKey,decodeToken,VerifyTokenWithProfile , authenticateTokenNew}