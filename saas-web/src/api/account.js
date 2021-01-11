import request from "@/utils/request";

const baseUserManageUrl = `/api/accounts`;

export function login(userName, password) {
  return request({
    url: `${baseUserManageUrl}/login`,
    method: "post",
    data: {
      userName,
      password
    }
  });
}

export function getUserInfo() {
  return request({
    url: `/api/users/current`,
    method: "get",
    params: {}
  });
}
