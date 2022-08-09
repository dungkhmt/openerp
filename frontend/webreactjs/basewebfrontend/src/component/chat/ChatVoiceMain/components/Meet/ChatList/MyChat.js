import { MSG_TYPE } from "component/chat/ChatVoiceMain/utils/constant";
import { useState } from "react";
import { handleTime } from "../../../utils/helpers";
import FileContent from "./FileContent";

const MyChat = ({ data, previewImage }) => {
  const [title, setTitle] = useState();
  const handleChangeTime = () => {
    setTitle(handleTime(Number(data.time)));
  };
  if (data?.fileUrl) {
    const { fileUrl, fileType } = data || {};
    return (
      <div style={{ marginTop: 10 }}>
        <div
          className="my-chat"
          style={{ textAlign: "right" }}
          title={title}
          onMouseEnter={handleChangeTime}
        >
          <FileContent
            fileUrl={fileUrl}
            fileType={fileType}
            previewImage={previewImage}
            type={MSG_TYPE.MY_CHAT}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="my-chat">
      <div
        className="chat-box my-chat-box"
        title={title}
        onMouseEnter={handleChangeTime}
      >
        {data?.content}
      </div>
    </div>
  );
};

export default MyChat;
