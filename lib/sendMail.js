import nodemailer from 'nodemailer';

const sendMail = async (userEmail, subject, message, userName) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER, // = your Gmail
      pass: process.env.PASS  // = App password
    }
  });

  const mailOptions = {
    from: userName, // Your Gmail shows as sender
    to: 'rakeshnayak2001@gmail.com',              // Where the message goes
    subject: subject,
    text: `From: ${userName}\nEmail: ${userEmail}\n\n${message}`,
    replyTo: userEmail // Allows you to reply directly to user's email
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

export default sendMail;
