export const API_URL = {
    SEARCH_FRIEND: '/roomParticipant/searchToInviteById',
    INVITE_FRIEND: '/roomParticipant/invite',
    INVITED_MEET: '/roomParticipant/getListInvitedRoom',
    OWNED_MEET: '/room/all',
    SCHEDULE_MEET: '/room/create',
}

export const QUERY_KEY = {
    SEARCH_FRIEND: 'searchFriend',
    INVITE_FRIEND: 'inviteFriend',
    INVITED_MEET: 'invitedMeet',
    OWNED_MEET: 'ownedMeet',
    SCHEDULE_MEET: 'scheduleMeet',
}

export const LIST_ICON = ['micro', 'camera', 'shareScreen', 'chat', 'participant', 'end'];

export const ADMIN_ID = '0';

export const CARD_LIST = ['host', 'join'];

export const ADMIN_CHAT_TYPE = {
    JOIN: 'join',
    LEAVE: 'leave',
}

export const BAR_TYPE = {
    CHAT: 'chat',
    PARTICIPANT: 'participant',
    NONE: 'none'
}

export const MEDIA_TYPE = {
    AUDIO: 'audio',
    VIDEO: 'video',
}

export const PEER_CONFIG = {
    iceServers: [{
        urls: ["stun:ss-turn2.xirsys.com"]
    }, {
        username: "z8Yi4hxyIRNswUGwsdmd4s75IJwlX-S0NDAtUcw70Zb4q28Gm6_jt5IPwo2q5Mi2AAAAAGI-YX9ob2FuZzMxMDU=",
        credential: "a34da8ec-ac9d-11ec-be20-0242ac140004",
        urls: [
            "turn:ss-turn2.xirsys.com:80?transport=udp",
            "turn:ss-turn2.xirsys.com:3478?transport=udp",
            "turn:ss-turn2.xirsys.com:80?transport=tcp",
            "turn:ss-turn2.xirsys.com:3478?transport=tcp",
            "turns:ss-turn2.xirsys.com:443?transport=tcp",
            "turns:ss-turn2.xirsys.com:5349?transport=tcp"
        ]
    }]
}

export const ENTER_KEY = 'Enter';

export const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 5,
};
