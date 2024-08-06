import jwt from 'jsonwebtoken';

const isAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(
      token,
      process.env.JWT_SECRET || 'somethingsecret',
      (err, decode) => {
        if (err) res.status(401).send({ message: { error: 'Invalid Token' } });
        else {
          res.user = decode;
          next();
        }
      },
    );
  } else res.status(401).send({ message: { error: 'No Token' } });
};

export default isAuth;
