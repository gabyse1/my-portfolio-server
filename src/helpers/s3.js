import aws from 'aws-sdk';

const region = process.env.AWS_REGION_G;
const bucketName = process.env.AWS_BUCKET_G;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID_G;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY_G;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4',
});

const generateUploadURL = async (fname) => {
  const params = ({
    Bucket: bucketName,
    Key: fname,
    Expires: 300,
  });

  const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
  return uploadUrl;
};

export default generateUploadURL;
