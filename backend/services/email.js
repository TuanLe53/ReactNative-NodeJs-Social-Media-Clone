const nodemailer = require('nodemailer');
require('dotenv').config();

const host_email = process.env.HOST_EMAIL;
const email_pw = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: host_email,
        pass: email_pw
    }
});

const sendResetPasswordEmail = async (email, token) => {
    try {
        await transporter.sendMail({
            from: host_email,
            to: email,
            subject: 'APP NAME: RESET PASSWORD',
            text: `This is an email for reset password. Token: ${token}`
        })
        console.log('Success')
    } catch (err) {
        console.log("Send email error:", err)
    }
}

module.exports = sendResetPasswordEmail;