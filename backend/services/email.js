const nodemailer = require('nodemailer');
require('dotenv').config();

const host_email = process.env.HOST_EMAIL;
const email_pw = process.env.EMAIL_PASSWORD;
const client_url = process.env.CLIENT_URL;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: host_email,
        pass: email_pw
    }
});

const sendResetPasswordEmail = async (email, token, userId) => {
    try {
        await transporter.sendMail({
            from: host_email,
            to: email,
            subject: 'APP NAME: RESET PASSWORD',
            text: `Click this link to reset your password: ${client_url}reset-password?token=${token}&id=${userId}`
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = sendResetPasswordEmail;