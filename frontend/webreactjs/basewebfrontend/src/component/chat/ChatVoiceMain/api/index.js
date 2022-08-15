import { request } from "../../../../api";
import { API_URL } from "../utils/constant";

export const getListSearchFriend = async (params) => {
  return request(
    "get",
    API_URL.SEARCH_FRIEND,
    undefined,
    undefined,
    undefined,
    { params }
  );
};

export const inviteFriend = async ({ userId, meetId, onSuccess, onError }) => {
  return request(
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
  return request("post", "/room/create", undefined, undefined, params);
};

export const getInvitedFriends = async (meetId) => {
  if (meetId) {
    return request(
      "get",
      API_URL.INVITED_FRIENDS,
      undefined,
      undefined,
      undefined,
      { params: { roomId: meetId } }
    );
  }
};

export const deleteMeet = async (params) => {
  return request("delete", API_URL.DELETE_MEET, undefined, undefined, params);
};

export const updateMeet = async (params) => {
  return request("put", API_URL.UPDATE_MEET, undefined, undefined, params);
};

export const uploadFile = async (formData) => {
  return request("post", API_URL.UPLOAD_FILE, undefined, undefined, formData);
};

export const getPresentMeets = async () => {
  return request("get", API_URL.PRESENT_MEET);
};
