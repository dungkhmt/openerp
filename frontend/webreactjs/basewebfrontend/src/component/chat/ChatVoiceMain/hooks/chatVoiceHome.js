import { useMutation, useQuery } from "react-query";
import {
  deleteMeet,
  getInvitedMeets,
  getOwnedMeets,
  scheduleMeet,
  updateMeet,
  getPresentMeets,
} from "../api";
import { QUERY_KEY } from "../utils/constant";

export const useGetInvitedMeets = ({ params, onSuccess, onError }) => {
  return useQuery(
    [QUERY_KEY.INVITED_MEET, params],
    () => getInvitedMeets(params),
    {
      onSuccess,
      onError,
      select: (res) => res?.data,
    }
  );
};

export const useGetOwnedMeets = ({ params, onSuccess, onError }) => {
  return useQuery([QUERY_KEY.OWNED_MEET, params], () => getOwnedMeets(params), {
    onSuccess,
    onError,
    select: (res) => res?.data,
  });
};

export const useScheduleMeet = ({ onSuccess, onError }) => {
  return useMutation(
    [QUERY_KEY.SCHEDULE_MEET],
    (params) => scheduleMeet(params),
    {
      onSuccess: onSuccess,
      onError,
    }
  );
};

export const useDeleteMeet = ({ onSuccess, onError }) => {
  return useMutation([QUERY_KEY.DELETE_MEET], (params) => deleteMeet(params), {
    onSuccess,
    onError,
  });
};

export const useUpdateMeet = ({ onSuccess, onError }) => {
  return useMutation([QUERY_KEY.UPDATE_MEET], (params) => updateMeet(params), {
    onSuccess,
    onError,
  });
};

export const useGetPresentMeets = ({ onSuccess, onError }) => {
  return useQuery([QUERY_KEY.PRESENT_MEET], () => getPresentMeets(), {
    onError,
    onSuccess,
    select: (res) => res?.data,
  });
};
