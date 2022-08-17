import AWS from "aws-sdk";
import cors from "cors";
import "dotenv/config";
import express from "express";
import multer from "multer";
import peer from "peer";
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
const uploadFileToS3 = (fileType, { buffer, mimetype }) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${uuid()}.${fileType}`,
    Body: buffer,
    ContentEncoding: 'base64',
    ContentType: mimetype,
    ACL: 'public-read',
  };
  return s3.upload(params).promise();
};
const uploadFile = async (req, res, next) => {
  try {
    const myFile = req.file.originalname.split(".");
    const fileType = myFile[myFile.length - 1];
    const fileUploaded = await uploadFileToS3(fileType, req.file);
    return res.status(200).json({ data: { url: fileUploaded.Location, fileType } });
  } catch (e) {
    console.error("ERROR_UPLOAD_FILE: ", e)
    res.status(400).json({ error: "Upload file failed" });
  }
};

app.post("/api/video-call/upload-file", upload, uploadFile);
