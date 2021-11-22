const crypto = require('crypto')

function securityKey(){
    return "awiueuegfyguygf";
}

function encrypt(word){
    var mykey = crypto.createCipher('aes-128-cbc',securityKey())
    var myStr = mykey.update(word,'utf8','hex')
    myStr += mykey.final('hex')
    return myStr
}
function decrypt(word){
    var myKey = crypto.createDecipher('aes-128-cbc',securityKey())
    var myStr = myKey.update(word,'hex','utf8')
    myStr += mykey.final('utf8')
    return myStr
}

module.exports = {encrypt,decrypt}