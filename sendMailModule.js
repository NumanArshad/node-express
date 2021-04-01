var nodemailer = require("nodemailer")

var transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        
    }
})