export const API_URL = {
  SEARCH_FRIEND: "/roomParticipant/searchToInviteById",
  INVITE_FRIEND: "/roomParticipant/invite",
  INVITED_FRIENDS: "/roomParticipant/invitedFriends",
  INVITED_MEET: "/roomParticipant/getListInvitedRoom",
  OWNED_MEET: "/room/all",
  SCHEDULE_MEET: "/room/create",
  DELETE_MEET: "/room",
  UPDATE_MEET: "/room",
  UPLOAD_FILE: "/video-call/upload-file",
  PRESENT_MEET: "/roomParticipant/getListPresentMeet",
};

export const QUERY_KEY = {
  SEARCH_FRIEND: "searchFriend",
  INVITE_FRIEND: "inviteFriend",
  INVITED_FRIENDS: "invitedFriend",
  INVITED_MEET: "invitedMeet",
  OWNED_MEET: "ownedMeet",
  SCHEDULE_MEET: "scheduleMeet",
  DELETE_MEET: "deleteMeet",
  UPDATE_MEET: "updateMeet",
  UPLOAD_FILE: "uploadFile",
  PRESENT_MEET: "presentMeet",
};

export const LIST_ICON = [
  "micro",
  "camera",
  "shareScreen",
  "chat",
  "participant",
  "end",
];

export const ADMIN_ID = "0";

export const CARD_LIST = ["host", "join"];

export const ADMIN_CHAT_TYPE = {
  JOIN: "join",
  LEAVE: "leave",
};

export const BAR_TYPE = {
  CHAT: "chat",
  PARTICIPANT: "participant",
  NONE: "none",
};

export const MEDIA_TYPE = {
  AUDIO: "audio",
  VIDEO: "video",
};

// export const PEER_CONFIG = {
//   config: {
//     iceServers: [
//       {
//         urls: ["stun:hk-turn1.xirsys.com"],
//       },
//       {
//         username:
//           "lL-EpB1zZ9uedAe-7RQdbceOOC1VDHoe9Hk7WcB-SjMf-uMbVBwoZvsTDW-lz6gBAAAAAGJBxihuZ3V5ZW5iYWhvYW5nMzkyMTEwNA==",
//         credential: "666906da-aea3-11ec-ab69-0242ac120004",
//         urls: [
//           "turn:hk-turn1.xirsys.com:80?transport=udp",
//           "turn:hk-turn1.xirsys.com:3478?transport=udp",
//           "turn:hk-turn1.xirsys.com:80?transport=tcp",
//           "turn:hk-turn1.xirsys.com:3478?transport=tcp",
//           "turns:hk-turn1.xirsys.com:443?transport=tcp",
//           "turns:hk-turn1.xirsys.com:5349?transport=tcp",
//         ],
//       },
//     ],
//   },
// };

export const PEER_SERVER = {
  secure: true,
  host: "/",
  port: "443",
  path: "/api/video-call/peer-server",
};

export const ENTER_KEY = "Enter";

export const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "fit-content",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
};

export const DISPLAY_TYPE = {
  HIGHLIGHT: "highlight",
  NORMAL: "normal",
};

export const DISPLAY_HOST = {
  FULL: "full",
  PART: "part",
  SMALL: "small",
};

export const IMG_TYPE = ["png", "jpeg", "gif", "jpg"];
export const VID_TYPE = ["mp4", "mov", "wmv", "avi", "flv", "webm"];
export const AUD_TYPE = ["m4a", "flac", "mp3", "wav", "wma", "aac"];

export const FILE_TYPE = {
  AUDIO: "audio",
  VIDEO: "video",
  IMAGE: "image",
  OTHER: "other",
};

export const MSG_TYPE = {
  MY_CHAT: "myChat",
  OTHERS_CHAT: "othersChat",
};
