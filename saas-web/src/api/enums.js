import request from "@/utils/request";

const baseUserManageUrl = `/api/enums`;

export function getEnums(query) {
  return request({
    url: `${baseUserManageUrl}`,
    method: "get",
    params: query
  });
}

export function getEnum(enumName) {
  return request({
    url: `${baseUserManageUrl}/${enumName}`,
    method: "get",
    params: {}
  });
}
