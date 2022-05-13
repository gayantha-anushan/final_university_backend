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

function VerifyTokenWithProfile(token,profile){
        var token = decodeToken(token);
        var data = Profile.find({_id:profile});
        if(data.length == 1){
            if(token.validity){
                if(token.uid == data[0].uid){
                    return "VALID"
                }else{
                    return "INVALID"
                }
            }else{
                return "INVALID"
            }
        }else{
            return "INVALID"
        }
}

module.exports = {secretKey,decodeToken,VerifyTokenWithProfile}