import {request} from "../Request";

export const getAllTags = (successHandler) => {
  request(
    "get",
    "/get-all-tags/",
    successHandler,
    {}
  ).then();
}

export const addNewTag = (body, successHandler, callback) => {
  request(
    "post",
    "/add-tag/",
    successHandler,
    {},
    body
  ).then(callback);
}