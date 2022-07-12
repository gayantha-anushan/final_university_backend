const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'leonardo.skiles74@ethereal.email',
        pass: 'BJkKV41tNZNBmMkkCw'
    }
});

function SendEmail(email,subject,text,html) {
    return new Promise(async (resolve, reject) => {
        try {
            let info = await transporter.sendMail({
                from: "Leornado Skiles <leonardo.skiles74@ethereal.email>",
                to: email,
                subject: subject,
                text: text,
                html:html
            })
            resolve(info)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {SendEmail};