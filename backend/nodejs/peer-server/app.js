import express from "express";
import "dotenv/config";
import cors from "cors";
import peer from "peer";
import multer from "multer";
import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";

const app = express();
const port = process.env.PORT || 3001;
const concurrent_limit = process.env.CONCURRENT_LIMIT || 50;

app.use(cors());

const server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at port: ${port}`);
});

const peerServer = peer.ExpressPeerServer(server, {
  concurrent_limit,
});

app.use("/api/video-call/peer-server", peerServer);

// upload file handle
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

const storage = multer.memoryStorage({
  destination: (req, res, callback) => {
    callback(null, "");
  },
});

const upload = multer({ storage }).single("file");
const uploadFileToS3 = ({ originalname, buffer }) => {
  const myFile = originalname.split(".");
  const fileType = myFile[myFile.length - 1];

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${uuid()}.${fileType}`,
    Body: buffer,
  };
  return s3.upload(params).promise();
};
const downloadFromS3 = (fileKey) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    Expires: 0,
  };
  return s3.getSignedUrl("getObject", params);
};
const uploadFile = async (req, res, next) => {
  try {
    // get file detail
    const fileUploaded = await uploadFileToS3(req.file);
    const fileKey = fileUploaded.Key;
    const url = downloadFromS3(fileKey);
    return res.status(200).json({ data: { url } });
  } catch (e) {
    next(e);
  }
};

app.post("/api/video-call/upload-file", upload, uploadFile);
