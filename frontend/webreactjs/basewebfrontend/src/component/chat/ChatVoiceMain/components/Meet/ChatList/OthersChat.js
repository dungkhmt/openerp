import { MSG_TYPE } from "component/chat/ChatVoiceMain/utils/constant";
import { useState } from "react";
import { handleTime } from "../../../utils/helpers";
import FileContent from "./FileContent";

const OthersChat = ({ data, previewImage }) => {
  const [title, setTitle] = useState();
  const handleChangeTime = () => {
    setTitle(handleTime(Number(data.time)));
  };
  if (data?.fileUrl) {
    const { fileUrl, fileType } = data || {};
    return (
      <div style={{ marginTop: 10 }}>
        <div title={title} onMouseEnter={handleChangeTime}>
          <div className="chat-title">{data.name}</div>
          <FileContent
            fileUrl={fileUrl}
            fileType={fileType}
            previewImage={previewImage}
            type={MSG_TYPE.OTHERS_CHAT}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="other-chat" title={title} onMouseEnter={handleChangeTime}>
      <div className="chat-title">{data.name}</div>
      <div className="chat-box others-chat-box">{data?.content}</div>
    </div>
  );
};

export default OthersChat;
