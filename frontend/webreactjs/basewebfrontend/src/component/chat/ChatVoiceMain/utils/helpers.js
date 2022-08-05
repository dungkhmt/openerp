import {
  AUD_TYPE,
  CARD_LIST,
  DISPLAY_HOST,
  DISPLAY_TYPE,
  FILE_TYPE,
  IMG_TYPE,
  VID_TYPE,
} from "./constant";

const MILISECOND_IN_ONE_DAY = 86400000;
const MILISECOND_IN_ONE_HOUR = 3600000;
const MILISECOND_IN_ONE_MINUTE = 60000;

export const handleTime = (time) => {
  const currentTime = new Date().getTime();
  const timeGap = currentTime - time;
  const day = Math.floor(timeGap / MILISECOND_IN_ONE_DAY);
  const hour = Math.floor(
    (timeGap - day * MILISECOND_IN_ONE_DAY) / MILISECOND_IN_ONE_HOUR
  );
  const min = Math.floor(
    (timeGap - day * MILISECOND_IN_ONE_DAY - hour * MILISECOND_IN_ONE_HOUR) /
      MILISECOND_IN_ONE_MINUTE
  );
  if (day > 0) return `Hơn ${day} ngày trước`;
  else if (hour > 0) return `Hơn ${hour} giờ trước`;
  else if (min > 0) return `Khoảng ${min} phút trước`;
  else return "Vừa xong";
};

export const getRandomStype = () => {
  return {
    backgroundColor: `rgb(${150 + Math.floor(Math.random() * 100)}, ${
      150 + Math.floor(Math.random() * 100)
    }, ${150 + Math.floor(Math.random() * 100)})`,
  };
};

export const getDisplayMedia = async () => {
  try {
    const constraints = {
      video: {
        cursor: "always",
      },

      auto: false,
    };
    return await navigator.mediaDevices.getDisplayMedia(constraints);
  } catch (err) {
    console.error("You need to allow sharing screen");
  }
};

export const getUserMedia = async (type) => {
  try {
    const constraints =
      type === "micro"
        ? {
            video: false,
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              sampleRate: 44100,
            },
          }
        : {
            video: true,
            audio: false,
          };
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (err) {
    console.error(err);
    alert("Chúng tôi cần sự cho phép của bạn để sử dụng máy ảnh và micro!");
  }
};

export const cardTitle = {
  [CARD_LIST[0]]: "Quản lý cuộc gặp của bạn",
  [CARD_LIST[1]]: "Tham gia một cuộc gặp khác",
};

export const displayHostMedia = (listParticipantMedia, displayType) => {
  if (displayType === DISPLAY_TYPE.HIGHLIGHT) return DISPLAY_HOST.SMALL;
  const numberOfMedia = listParticipantMedia.length;
  switch (numberOfMedia) {
    case 0:
      return DISPLAY_HOST.FULL;
    case 1:
      return DISPLAY_HOST.PART;
    default:
      return DISPLAY_HOST.SMALL;
  }
};

export const stopMediaStream = (mediaStream) => {
  try {
    mediaStream?.getTracks()?.forEach((track) => track.stop());
  } catch (e) {
    console.error(e);
  }
};

export const stopAndSetMediaStream = (setMediaStream) => {
  try {
    setMediaStream((mediaStream) => {
      mediaStream?.getTracks()?.forEach((track) => track.stop());
    });
  } catch (e) {
    console.error(e);
  }
};

export const getFileType = (fileType) => {
  const _fileType = fileType.toLowerCase();
  if (IMG_TYPE.includes(_fileType)) return FILE_TYPE.IMAGE;
  if (AUD_TYPE.includes(_fileType)) return FILE_TYPE.AUDIO;
  if (VID_TYPE.includes(_fileType)) return FILE_TYPE.VIDEO;
  return FILE_TYPE.OTHER;
};
