import { useMutation, useQuery } from "react-query"
import { getListSearchFriend, inviteFriend } from "../api";
import { QUERY_KEY } from "../ultis/constant"

export const useGetListSearchFriend = ({ params, onSuccess, onError }) => {
  return useQuery([QUERY_KEY.SEARCH_FRIEND, params], () => getListSearchFriend(params), {
    onSuccess,
    onError,
    select: (res) => res.data || {},
  });
}

export const useInviteFriend = ({ userId, meetId, onSuccess, onError }) => {
  return useMutation([QUERY_KEY.INVITE_FRIEND, userId, meetId], () => inviteFriend({ userId, meetId }), {
    onSuccess,
    onError,
  });
}