var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'govisaviya@gmail.com',
    pass: 'Project@finalyear'
  }
});

var mailOptions = {
  from: 'govisaviya@gmail.com',
  to: '',
  subject: '',
  text: ``
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

// npm install nodemailer
// signup in sendinblue
// goto dashboard
// smtp and api 
// create a new api key 
// yarn i sib-api-v3-sdk
// API_KEY = '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'