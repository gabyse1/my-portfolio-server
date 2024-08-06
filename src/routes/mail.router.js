import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';

const mailRouter = Router();

// routes
mailRouter.post('/send',
  expressAsyncHandler(async (req, res) => {
    const mailData = {
      from: process.env.MAIL_SENDER_USER,
      to: process.env.MAIL_RECEIVER_USER,
      subject: '[Portfolio] Contact message',
      html: `<h1>Contact Message</h1>
        <h2>From: ${req.body.fullname} ${req.body.email}</h2>
        <p>${req.body.message}</p>`,
    };

    const transporter = nodemailer.createTransport({
      port: 465,
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.MAIL_SENDER_USER,
        pass: process.env.MAIL_SENDER_PASSWORD,
      },
      secure: true,
    });

    transporter.sendMail(mailData, (error) => {
      if (error) res.status(500).send('Something went wrong. Try it again.');
      else res.send('Email successfully sent to recipient.');
    });
  }));

export default mailRouter;
