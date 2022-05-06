const jwt = require("jsonwebtoken")

function secretKey(){
    return "1234567899787531"
}

function decodeToken(token){
    try{
        const decoded = jwt.verify(token,secretKey())
        const email = decoded.email;
        return {
            validity:true,
            email:email
        }
    }catch(error){
        console.log(error)
        return {
            validity:false,
            error:error
        }
    }
}

module.exports = {secretKey,decodeToken}