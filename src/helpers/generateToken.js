import jwt from 'jsonwebtoken';

/* eslint no-underscore-dangle: 0 */

const generateToken = (user) => jwt.sign(
  {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  },
  process.env.JWT_SECRET || 'somethingsecret',
  {
    expiresIn: '30d',
  },
);

export default generateToken;
