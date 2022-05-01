import { request } from "../../../../api"
import { API_URL } from "../ultis/constant"

export const getListSearchFriend = async (params) => {
  return await request('get', API_URL.SEARCH_FRIEND, undefined, undefined, undefined, { params });
}

export const inviteFriend = async ({ userId, meetId }) => {
  return await request('post', API_URL.INVITE_FRIEND, undefined, undefined, {
    userLoginId: userId,
    roomId: meetId,
  });
}

export const getInvitedMeets = async (params) => {
  return await request('get', API_URL.INVITED_MEET);
}

export const getOwnedMeets = async (params) => {
  return await request('get', API_URL.OWNED_MEET)
}