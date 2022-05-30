export const API_URL = {
  SEARCH_FRIEND: "/roomParticipant/searchToInviteById",
  INVITE_FRIEND: "/roomParticipant/invite",
  INVITED_FRIENDS: "/roomParticipant/invitedFriends",
  INVITED_MEET: "/roomParticipant/getListInvitedRoom",
  OWNED_MEET: "/room/all",
  SCHEDULE_MEET: "/room/create",
};

export const QUERY_KEY = {
  SEARCH_FRIEND: "searchFriend",
  INVITE_FRIEND: "inviteFriend",
  INVITED_FRIENDS: "invitedFriend",
  INVITED_MEET: "invitedMeet",
  OWNED_MEET: "ownedMeet",
  SCHEDULE_MEET: "scheduleMeet",
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

export const PEER_CONFIG = {
  iceServers: {
    username:
      "MSsnbHHeJoWkaT6p1QpCMnC-Gp0iqCO23If_LuqjYWLCRtxJCihldO6AVo1TBuMfAAAAAGKUI-luZ3V5ZW5iYWhvYW5nMzkyMTEwNA==",
    urls: [
      "stun:hk-turn1.xirsys.com",
      "turn:hk-turn1.xirsys.com:80?transport=udp",
      "turn:hk-turn1.xirsys.com:3478?transport=udp",
      "turn:hk-turn1.xirsys.com:80?transport=tcp",
      "turn:hk-turn1.xirsys.com:3478?transport=tcp",
      "turns:hk-turn1.xirsys.com:443?transport=tcp",
      "turns:hk-turn1.xirsys.com:5349?transport=tcp",
    ],
    credential: "7d0e92e4-dfbb-11ec-841f-0242ac120004",
  },
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
