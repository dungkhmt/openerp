import { useState } from "react";
import { request } from "../../api";

export default function ChatMain() {
  const id = "myfile";
  const [fileId, setFileId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  function handleChangeFile(e) {
    setSelectedFile(e.target.files[0]);
  }
  function handleUpload() {
    let body = {
      id: id,
    };
    let formData = new FormData();
    formData.append("inputJson", JSON.stringify(body));
    formData.append("file", selectedFile);

    const config = {
      headers: {
        "content-Type": "multipart/form-data",
      },
    };

    request(
      "post",
      "/content/create",
      (res) => {
        res = res.data;
        console.log("result upload = ", res);
        setFileId(res.id);
      },
      {
        onError: (e) => {
          console.error("EXCEPTION ", e);
        },
      },
      formData,
      config
    );
  }

  function downloadFile() {
    request(
      "get",
      "/content/get/" + fileId,
      (res) => {
        console.log("result download = ", res.data);
      },
      {
        onError: (e) => {
          console.error(e);
        },
      }
    );
  }

  return (
    <div>
      <h1>This is a chat messenger</h1>
      <input type="file" onChange={handleChangeFile}></input>
      <button onClick={handleUpload}>Upload</button>
      <input
        type="text"
        value={fileId}
        onChange={(e) => setFileId(e.target.value)}
      ></input>
      <button onClick={downloadFile}>Download</button>
    </div>
  );
}
