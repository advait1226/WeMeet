// Nodemailer code 

var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport(
    {
        service:'gmail',
        auth:{
            user: 'abc@gmail.com',      //Enter the email address
            pass:  'abcdefghijkl'     // Enter the password
        }
    }
);

// send out email

var mailOptions = {
    from:       'abc@gmail.com',      //Enter the email address
    to:         'abc@gmail.com, def@gmail.com',      //Enter the email address
    subject:    'Enter subject',      //Enter Subject
    text:       'Enter Body'          //Enter Body
};

transport.sendMail(mailOptions, function(err, info){
    if(err){
        console.log(err)
    }else{
        console.log('Email sent' + info.response)
    }
});