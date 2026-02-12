const nodemailer = require("nodemailer");

async function sendVerificationEmail(to, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "a0ad18001@smtp-brevo.com",
        pass: process.env.BREVO_API_KEY,
      },
    });

    const mailOptions = {
      from: `"Selfy Snap" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return info;

  } catch (err) {
    console.error("❌ Email error:", err.message);
    throw err;
  }
}

module.exports = { sendVerificationEmail };
