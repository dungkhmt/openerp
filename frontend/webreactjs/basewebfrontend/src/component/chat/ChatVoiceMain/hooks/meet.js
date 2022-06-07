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

export const useInviteFriend = ({ meetId, onSuccess, onError }) => {
  const queryClient = useQueryClient();
  return useMutation(
    [QUERY_KEY.INVITE_FRIEND, meetId],
    ({ userId }) => inviteFriend({ userId, meetId, onSuccess, onError }),
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
