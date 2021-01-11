import request from "@/utils/request";
import { formatParams } from "@/utils/index";

const baseUserManageUrl = `/api/users`;

export function list(query) {
  return request({
    url: `${baseUserManageUrl}`,
    method: "get",
    params: formatParams(query)
  });
}

export function add(data) {
  return request({
    url: `${baseUserManageUrl}`,
    method: "post",
    data: data
  });
}

export function getById(id) {
  return request({
    url: `${baseUserManageUrl}/${id}`,
    method: "get",
    params: {}
  });
}

export function update(id, data) {
  return request({
    url: `${baseUserManageUrl}/${id}`,
    method: "put",
    data: data
  });
}

export function getByUserName(userName) {
  return request({
    url: `${baseUserManageUrl}/by-username/${userName}`,
    method: "get",
    params: {}
  });
}

export function changePassword(data) {
  return request({
    url: `${baseUserManageUrl}/current/change-password`,
    method: "put",
    data: data
  });
}

export function setPasswordByAdmin(id, data) {
  return request({
    url: `${baseUserManageUrl}/${id}/set-password-by-admin`,
    method: "put",
    data: data
  });
}

export function remove(id) {
    return request({
        url: `${baseUserManageUrl}/${id}`,
        method: "delete",
        data: {}
    });
}

export function userAuthList(params) {
  return request({
    url: `${baseUserManageUrl}/auth`,
    method: "get",
    params
  });
}

export function userAuth(userId) {
  return request({
    url: userId ? `${baseUserManageUrl}/auth/${userId}` : `${baseUserManageUrl}/auth`,
    method: "get",
  });
}

export function authSave(data) {
  return request({
    url: `${baseUserManageUrl}/auth`,
    method: "post",
    data: data
  });
}

export function allUser() {
  return request({
    url: `${baseUserManageUrl}`,
    method: "get",
  });
}

export function clone(data) {
  return request({
    url: `${baseUserManageUrl}/auth/clone`,
    method: "post",
    data: data
  });
}