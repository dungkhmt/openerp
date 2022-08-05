import classNames from "classnames";
import {
  FILE_TYPE,
  MSG_TYPE,
} from "component/chat/ChatVoiceMain/utils/constant";
import { getFileType } from "component/chat/ChatVoiceMain/utils/helpers";
import { BsFileEarmarkArrowDown } from "react-icons/bs";

export default function FileContent({ fileUrl, fileType, previewImage, type }) {
  const _fileType = getFileType(fileType);
  const handleClick = () => {
    previewImage(fileUrl);
  };

  return (
    <>
      {_fileType === FILE_TYPE.IMAGE && (
        <img src={fileUrl} alt="" width="75%" onClick={handleClick} />
      )}
      {_fileType === FILE_TYPE.AUDIO && <audio src={fileUrl} controls />}
      {_fileType === FILE_TYPE.VIDEO && (
        <video src={fileUrl} width="75%" controls itemType="video/*" />
      )}
      {_fileType === FILE_TYPE.OTHER && (
        <a
          href={fileUrl}
          className={classNames(
            "chat-box",
            type === MSG_TYPE.MY_CHAT ? "my-chat-box" : "others-chat-box"
          )}
          style={{ textAlign: "center" }}
        >
          <BsFileEarmarkArrowDown size={60} />
          <div>Tải xuống</div>
        </a>
      )}
    </>
  );
}
