import { getFileType } from "component/chat/ChatVoiceMain/utils/helpers";

export default function FileContent({ fileUrl, fileType }) {
  const _fileType = getFileType(fileType);
  return <div>{_fileType}</div>;
}
