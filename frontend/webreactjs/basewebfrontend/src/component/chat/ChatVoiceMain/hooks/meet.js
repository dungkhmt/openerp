import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getListSearchFriend,
  inviteFriend,
  getInvitedFriends,
  uploadFile,
} from "../api";
import { QUERY_KEY } from "../utils/constant";

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
      onError,
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

export const useUploadFile = ({ onSuccess, onError }) => {
  return useMutation(
    [QUERY_KEY.UPLOAD_FILE],
    (formData) => uploadFile(formData),
    {
      onSuccess,
      onError,
    }
  );
};
