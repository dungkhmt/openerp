import { useState } from "react";
import { handleTime } from "../../../utils/helpers";
import FileContent from "./FileContent";

const MyChat = ({ data }) => {
  const [title, setTitle] = useState();
  const handleChangeTime = () => {
    setTitle(handleTime(Number(data.time)));
  };
  if (data?.fileUrl) {
    const { fileUrl, fileType } = data || {};
    return (
      <div>
        <div className="my-chat" title={title} onMouseEnter={handleChangeTime}>
          <div className="chat-box my-chat-box">
            <img src={fileUrl} width="100%" />
          </div>
        </div>
        <div className="my-chat" title={title} onMouseEnter={handleChangeTime}>
          <div className="chat-box my-chat-box-hidden">
            <img src={fileUrl} width="100%" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="my-chat" title={title} onMouseEnter={handleChangeTime}>
        <div className="chat-box my-chat-box">{data?.content}</div>
      </div>
      <div className="my-chat" title={title} onMouseEnter={handleChangeTime}>
        <div className="chat-box my-chat-box-hidden">{data?.content}</div>
      </div>
    </div>
  );
};

export default MyChat;
