import request from "@/utils/request";
import { formatParams } from "@/utils/index";

const baseCorporationManageUrl = `/api/external-apps`;

export function list(query) {
  return request({
    url: `${baseCorporationManageUrl}`,
    method: "get",
    params: formatParams(query)
  });
}

export function add(data) {
  return request({
    url: `${baseCorporationManageUrl}`,
    method: "post",
    data: data
  });
}

export function getById(id) {
  return request({
    url: `${baseCorporationManageUrl}/${id}`,
    method: "get",
    params: {}
  });
}

export function update(id, data) {
  return request({
    url: `${baseCorporationManageUrl}/${id}`,
    method: "put",
    data: data
  });
}

export function remove(id) {
  return request({
    url: `${baseCorporationManageUrl}/${id}`,
    method: "delete",
    data: {}
  });
}

export function getByExternalAppId(externalAppId) {
  return request({
    url: `${baseCorporationManageUrl}/by-ak/${externalAppId}`,
    method: "get",
    params: {}
  });
}
