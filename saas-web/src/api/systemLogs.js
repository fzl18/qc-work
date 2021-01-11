import request from "@/utils/request";
import { formatParams } from "@/utils/index";

const baseUserManageUrl = `/api/operation-log`;

export function list(query) {
  return request({
    url: `${baseUserManageUrl}`,
    method: "get",
    params: formatParams(query)
  });
}

export function commonData() {
  return request({
    url: `${baseUserManageUrl}/commonData`,
    method: "get",
  });
}