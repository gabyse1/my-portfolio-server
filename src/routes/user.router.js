import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import User from '../models/User';
import generateToken from '../helpers/generateToken';
import isAuth from '../helpers/isAuth';
import validateSigninInput from '../validations/signin';
import validateSignupInput from '../validations/signup';
import validateProfileInput from '../validations/profile';

/* eslint no-underscore-dangle: 0 */

const userRouter = express.Router();

userRouter.post('/signin',
  expressAsyncHandler(async (req, res) => {
    const { errors, isValid } = validateSigninInput(req.body);
    if (!isValid) return res.status(400).send({ message: errors });

    const user = await User.findOne({ email: req.body.email });
    if (!user) res.status(401).send({ message: { email: 'Invalid user email' } });

    if (user.status !== 'Active') return res.status(401).send({ message: { error: 'Pending Account. Please verify your email!' } });

    if (!bcrypt.compareSync(req.body.password, user.password)) return res.status(401).send({ message: { password: 'Invalid user password' } });

    return res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      accessToken: generateToken(user),
    });
  }));

userRouter.post('/signup',
  expressAsyncHandler(async (req, res) => {
    const { errors, isValid } = validateSignupInput(req.body);
    if (!isValid) return res.status(400).send({ message: errors });

    const existedUser = await User.findOne({ email: req.body.email });

    if (existedUser) return res.status(400).send({ message: { error: 'There is already a registered user with this email.' } });

    const newUser = new User({
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 8),
      confirmationCode: generateToken(req.body),
    });

    const savedNewUser = await newUser.save();

    if (!savedNewUser) return res.status(500).send({ message: { error: 'Something went wrong. Try it again.' } });

    const mailData = {
      from: process.env.MAIL_SENDER_USER,
      to: savedNewUser.email,
      subject: 'Please confirm your account',
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${savedNewUser.name}</h2>
        <p>Please confirm your email by clicking on the following link</p>
        <a href=${process.env.URL || 'http://localhost:3000'}/portfolio-admin/confirm/${savedNewUser.confirmationCode}> Click here</a>`,
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

    transporter.sendMail(mailData);
    return res.send({ message: { success: 'User was registered successfully!. Please check your email.' } });
  }));

userRouter.get('/confirm/:confCode',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ confirmationCode: req.params.confCode });
    if (!user) return res.status(404).send({ message: { error: 'User not found' } });

    user.status = 'Active';
    const confirmedUser = await user.save();
    if (!confirmedUser) return res.status(500).send({ message: { error: 'Unable to confirm the account. Try it again.' } });

    return res.send({ message: { success: 'Your email was confirmed successfully!. Login a session.' } });
  }));

userRouter.post('/edit',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const {
      userId, name, email, password,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ message: { error: 'User Not Found' } });

    user.name = name || user.name;
    user.email = email || user.email;

    const { errors, isValid } = validateProfileInput({ name, email, password });
    if (!isValid) return res.status(400).send({ message: errors });

    if (password.trim() !== '') user.password = bcrypt.hashSync(password, 8);
    const updatedUser = await user.save();

    return res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      accessToken: generateToken(updatedUser),
    });
  }));

userRouter.get('/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) res.send(user);
    else res.status(404).send({ message: { error: 'User Not Found' } });
  }));

export default userRouter;
