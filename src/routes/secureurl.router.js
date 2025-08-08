import { Router } from 'express';
import generateUploadURL from '../helpers/supabaseStorageBucket';

const secureurlRouter = Router();

// routes
const wrap = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

secureurlRouter.post('/bucketurl', wrap(async (req, res) => {
  const url = await generateUploadURL(req, res);
  return url;
}));

export default secureurlRouter;
