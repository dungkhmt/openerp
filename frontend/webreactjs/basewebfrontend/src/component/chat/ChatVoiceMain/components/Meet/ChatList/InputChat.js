import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { MdAttachFile } from "react-icons/md";
import { BsFileEarmarkArrowUp } from "react-icons/bs";
import { Box, CircularProgress } from "@material-ui/core";
import { useUploadFile } from "component/chat/ChatVoiceMain/hooks/meet";

const InputMess = (props) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState();
  const [fileInfo, setFileInfo] = useState();
  const { mutateAsync: uploadFile, isLoading } = useUploadFile({});

  const submitOnEnter = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      submit();
      e.preventDefault();
    }
  };
  const submit = () => {
    if (content.trim() !== "") {
      props.sendMessage("chat", content.trim());
      setContent("");
    }
    if (fileInfo) {
      props.sendMessage("file", undefined, fileInfo.url, fileInfo.fileType);
      setFile(undefined);
      setFileInfo("");
    }
  };
  const handleChangeFile = async (e) => {
    const fileList = e.target.files;
    if (fileList) {
      setFile(fileList[0]);
      const formData = new FormData();
      formData.append("file", fileList[0]);
      const fileUrl = await uploadFile(formData);
      setFileInfo(fileUrl?.data?.data);
    }
  };
  const handleDropFile = () => {
    setFile(undefined);
  };
  const handleClickFile = (e) => {
    e.target.value = null;
  };

  useEffect(() => {
    if (!!file) setContent("");
  }, [file]);

  return (
    <div>
      {file && (
        <div className="upload-file-chat">
          {isLoading ? (
            <CircularProgress size={20} />
          ) : (
            <BsFileEarmarkArrowUp size={20} />
          )}
          <Box
            component="div"
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              maxWidth: 230,
              display: "inline-block",
              whiteSpace: "nowrap",
              marginLeft: 4,
            }}
          >
            {file.name}
          </Box>
          <div className="upload-file-chat__close" onClick={handleDropFile}>
            x
          </div>
        </div>
      )}
      <textarea
        className="textarea-chat"
        rows="1"
        disabled={!!file}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={submitOnEnter}
      />
      <IoSend className="chat-button" onClick={submit} />
      <label className="chat-button attach-file" htmlFor="upload-file">
        <MdAttachFile />
      </label>
      <input
        type={"file"}
        id="upload-file"
        onChange={handleChangeFile}
        onClick={handleClickFile}
        style={{ display: "none" }}
        multiple={false}
      />
    </div>
  );
};

export default InputMess;
