const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_APIKEY)

const sendWelcomeMsg = (email, name) => {
    const msg = {
        from: 'richa.khetan22@gmail.com',
        to: email,
        subject: `Hey ${name}!!!`,
        html: `<strong>Welcome to our application.</strong>`,
    };

    sgMail.send(msg);
}

module.exports = {
    sendWelcomeMsg
}