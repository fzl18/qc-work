import request from "@/utils/request";
import { formatParams } from "@/utils/index";

const baseDbInstanceManageUrl = `/api/db-instances`;

export function list(query) {
  return request({
    url: `${baseDbInstanceManageUrl}`,
    method: "get",
    params: formatParams(query)
  });
}

export function getById(id) {
  return request({
    url: `${baseDbInstanceManageUrl}/${id}`,
    method: "get",
    params: {}
  });
}

export function add(data) {
  return request({
    url: `${baseDbInstanceManageUrl}`,
    method: "post",
    data: data
  });
}

export function update(id, data) {
  return request({
    url: `${baseDbInstanceManageUrl}/${id}`,
    method: "put",
    data: data
  });
}

export function updateDeployCredential(id, data) {
  return request({
    url: `${baseDbInstanceManageUrl}/${id}/update-deploy-credential`,
    method: "put",
    data: data
  });
}

export function remove(id) {
  return request({
    url: `${baseDbInstanceManageUrl}/${id}`,
    method: "delete",
    data: {}
  });
}
