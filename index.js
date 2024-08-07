import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import './src/database';
import secureurlRouter from './src/routes/secureurl.router';
import userRouter from './src/routes/user.router';
import toolRouter from './src/routes/tool.router';
import projectRouter from './src/routes/project.router';
import mailRouter from './src/routes/mail.router';

// set environment
if (process.env.NODE_ENV !== 'production') dotenv.config();

// initialization
const app = express();

// settings
app.set('port', process.env.SERVER_PORT || 5000);

// middlewares
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: `${process.env.FRONT_URL || 'http://localhost'}:${process.env.FRONT_PORT || 3000}` }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, './client/build')));

// routes
app.use('/api/s3', secureurlRouter);
app.use('/api/tools', toolRouter);
app.use('/api/projects', projectRouter);
app.use('/api/users', userRouter);
app.use('/api/mail', mailRouter);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

// error handler
app.use((error, req, res) => {
  const { code, keyValue } = error;
  if (code === 11000) {
    const customError = new Error(`This ${Object.keys(keyValue)[0]} is already in use`);
    return res.status(409).send({ message: customError.message });
  }
  return res.status(500).send({ message: error.message });
});

// start server
app.listen(app.get('port'), () => {
  console.log(`Server listening on port ${app.get('port')}`);
});
