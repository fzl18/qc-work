import request from "@/utils/request";
import { formatParams } from "@/utils/index";

const baseSystemConfigurationsUrl = `/api/system-configurations`;

export function list(query) {
  return request({
    url: `${baseSystemConfigurationsUrl}`,
    method: "get",
    params: formatParams(query)
  });
}

export function getByKey(key) {
  return request({
    url: `${baseSystemConfigurationsUrl}/${key}`,
    method: "get",
    params: {}
  });
}

export function update(key, data) {
  return request({
    url: `${baseSystemConfigurationsUrl}/${key}`,
    method: "put",
    data: data
  });
}
