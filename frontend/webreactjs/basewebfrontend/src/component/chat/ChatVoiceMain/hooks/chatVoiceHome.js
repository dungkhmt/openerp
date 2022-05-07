import { useMutation, useQuery } from "react-query"
import { getInvitedMeets, getOwnedMeets, scheduleMeet } from "../api";
import { QUERY_KEY } from "../ultis/constant"

export const useGetInvitedMeets = ({ params, onSuccess, onError }) => {
  return useQuery([QUERY_KEY.INVITED_MEET, params], () => getInvitedMeets(params), {
    onSuccess,
    onError,
    select: (res) => res?.data,
  });
}

export const useGetOwnedMeets = ({ params, onSuccess, onError }) => {
  return useQuery([QUERY_KEY.OWNED_MEET, params], () => getOwnedMeets(params), {
    onSuccess,
    onError,
    select: (res) => res?.data,
  });
}

export const useScheduleMeet = ({ params, onSuccess, onError }) => {
  return useMutation([QUERY_KEY.SCHEDULE_MEET, params], () => scheduleMeet(params), {
    onSuccess: onSuccess,
    onError,
  });
}