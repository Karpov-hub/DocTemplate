const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  DeleteObjectCommand
} = require("@aws-sdk/client-s3");
const s3 = new S3Client({ region: "eu-west-2" });
const Bucket =
  process.env.NODE_ENV === "production" ? "novatum-prod" : "novatum-test";

async function push(file) {
  const uploadParams = {
    Bucket,
    Key: file.code,
    // Content of the new object.
    Body: file.data
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return {
    success: true
  };
}

async function pull(Key) {
  const bucketParams = {
    Bucket,
    Key
  };
  const data = await s3.send(new GetObjectCommand(bucketParams));
  return {
    stream: data.Body,
    isBase64: false
  };
}

async function exists(Prefix) {
  const bucketParams = {
    Bucket,
    Prefix
  };
  const data = await s3.send(new ListObjectsCommand(bucketParams));
  return data.Contents && data.Contents.length === 1;
}

async function del(Key) {
  const bucketParams = {
    Bucket,
    Key
  };
  const data = await s3.send(new DeleteObjectCommand(bucketParams));
  return data["$metadata"].httpStatusCode === 204;
}

async function watermarkFile(code) {
  return {
    success: true,
    code: code
  };
}

export default {
  push,
  pull,
  exists,
  del,
  watermarkFile
};
