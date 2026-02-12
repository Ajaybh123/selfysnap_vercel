const nodemailer = require("nodemailer");

async function sendVerificationEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: "a0ad18001@smtp-brevo.com",
      pass: process.env.BREVO_API_KEY,
    },
  });

  await transporter.verify();

  const mailOptions = {
    from: `"Selfy Snap" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };
