import { useMutation, useQuery, useQueryClient } from "react-query";
import { getListSearchFriend, inviteFriend, getInvitedFriends } from "../api";
import { QUERY_KEY } from "../ultis/constant";

export const useGetListSearchFriend = ({ params, onSuccess, onError }) => {
  return useQuery(
    [QUERY_KEY.SEARCH_FRIEND, params],
    () => getListSearchFriend(params),
    {
      onSuccess,
      onError,
      select: (res) => res.data || {},
    }
  );
};

export const useInviteFriend = ({ userId, meetId }) => {
  const queryClient = useQueryClient();
  return useMutation(
    [QUERY_KEY.INVITE_FRIEND, userId, meetId],
    () => inviteFriend({ userId, meetId }),
    {
      onSuccess: () => {
        queryClient.refetchQueries([QUERY_KEY.INVITED_FRIENDS]);
      },
    }
  );
};

export const useGetInvitedFriends = ({ meetId, onSuccess, onError }) => {
  return useQuery(
    [QUERY_KEY.INVITED_FRIENDS, meetId],
    () => getInvitedFriends(meetId),
    {
      onSuccess,
      onError,
      select: (res) => res?.data || {},
    }
  );
};
