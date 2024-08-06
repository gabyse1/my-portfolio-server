import { Router } from 'express';
import generateUploadURL from '../helpers/s3';

const secureurlRouter = Router();

// routes
secureurlRouter.get('/s3url/:fname', async (req, res) => {
  const url = await generateUploadURL(req.params.fname);
  return res.send({ url });
});

export default secureurlRouter;
