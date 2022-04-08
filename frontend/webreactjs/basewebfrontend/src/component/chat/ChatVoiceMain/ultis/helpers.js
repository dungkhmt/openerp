import { CARD_LIST } from "./constant";

const MILISECOND_IN_ONE_DAY = 86400000;
const MILISECOND_IN_ONE_HOUR = 3600000;
const MILISECOND_IN_ONE_MINUTE = 60000;
const MILISECOND_IN_ONE_SECOND = 1000;

export const handleTime = (time) => {
  const currentTime = new Date().getTime();
  const timeGap = currentTime - time;
  const day = Math.floor(timeGap / MILISECOND_IN_ONE_DAY);
  const hour = Math.floor((timeGap - day * MILISECOND_IN_ONE_DAY) / MILISECOND_IN_ONE_HOUR);
  const min = Math.floor((timeGap - day * MILISECOND_IN_ONE_DAY - hour * MILISECOND_IN_ONE_HOUR) / MILISECOND_IN_ONE_MINUTE);
  const second = Math.floor((timeGap - day * MILISECOND_IN_ONE_DAY - hour * MILISECOND_IN_ONE_HOUR - min * MILISECOND_IN_ONE_MINUTE) / MILISECOND_IN_ONE_SECOND);
  if (day > 0) return `Hơn ${day} ngày trước`;
  else if (hour > 0) return `Hơn ${hour} giờ trước`;
  else if (min > 0) return `Khoảng ${min} phút trước`;
  else return 'Vừa xong';
}

export const getRandomStype = () => { 
  return { backgroundColor: `rgb(${150 + Math.floor(Math.random() * 100)}, ${150 + Math.floor(Math.random() * 100)}, ${150 + Math.floor(Math.random() * 100)})` }
};

export const getDisplayMedia = async () => {
  try {
    const constraints = {
      video: {
        cursor: "always"
      },
      // audio: {
      //   echoCancellation: true,
      //   noiseSuppression: true,
      //   sampleRate: 44100
      // }
      auto: false
    };
    return await navigator.mediaDevices.getDisplayMedia(constraints);
  } catch (err) {
    console.error("You need to allow sharing screen");
  }
};

export const getUserMedia = async (type) => {
  try {
    const constraints = (type === 'micro') ? {
      video: false,
      audio: true,
    } : {
      video: true,
      audio: false,
    };
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (err) {
    console.error(err);
    alert('We need your permission to use the camera and microphone!');
  }
};

export const cardTitle = {
  [CARD_LIST[0]]: 'Host A Meet',
  [CARD_LIST[1]]: 'Join A Meet',
}

export const displayHostMedia = (listParticipantMedia) => {
  const numberOfMedia = listParticipantMedia.length;
  switch(numberOfMedia) {
    case 0: return 'full';
    case 1: return 'part';
    default: return 'small'
  }
}