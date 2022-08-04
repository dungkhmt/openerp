import express from "express";
import "dotenv/config";
import cors from "cors";
import peer from "peer";

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

app.use("/", peerServer);
app.get("/test", (req, res) => {
  console.log("tesssst");
  res.send("hello world");
});
