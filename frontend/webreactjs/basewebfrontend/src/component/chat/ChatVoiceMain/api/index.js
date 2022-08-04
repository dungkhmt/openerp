import { request } from "../../../../api";
import { API_URL } from "../utils/constant";

export const getListSearchFriend = async (params) => {
  return await request(
    "get",
    API_URL.SEARCH_FRIEND,
    undefined,
    undefined,
    undefined,
    { params }
  );
};

export const inviteFriend = async ({ userId, meetId, onSuccess, onError }) => {
  return await request(
    "post",
    API_URL.INVITE_FRIEND,
    onSuccess,
    { onError },
    {
      userLoginId: userId,
      roomId: meetId,
    }
  );
};

export const getInvitedMeets = async (params) => {
  return await request("get", API_URL.INVITED_MEET);
};

export const getOwnedMeets = async (params) => {
  return await request("get", API_URL.OWNED_MEET);
};

export const scheduleMeet = async (params) => {
  return await request("post", "/room/create", undefined, undefined, params);
};

export const getInvitedFriends = async (meetId) => {
  if (meetId) {
    return await request(
      "get",
      API_URL.INVITED_FRIENDS,
      undefined,
      undefined,
      undefined,
      { params: { roomId: meetId } }
    );
  }
};
