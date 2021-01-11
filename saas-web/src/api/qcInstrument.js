import request from "@/utils/request";
import { formatParams } from "@/utils/index";

/**
 * 标准合约维护api
 */
const url = `/api/instrument`;
export const baseUrl = url;

export function list(query) {
    return request({
        url: `${url}`,
        method: "get",
        params: formatParams(query)
    });
}


export function getInstrumentList(query) {
    return request({
        url: `${url}/GetInstruments`,
        method: "get",
        params: formatParams(query)
    });
}


export function add(data) {
    return request({
        url: `${url}`,
        method: "post",
        data: data
    });
}

export function getById(id) {
    return request({
        url: `${url}/${id}`,
        method: "get",
        params: {}
    });
}

export function update(id, data) {
    return request({
        url: `${url}/${id}`,
        method: "put",
        data: data
    });
}

export function remove(id) {
    return request({
        url: `${url}/${id}`,
        method: "delete",
        data: {}
    });
}

/**
 * 启用/停用
 * @param id
 */
export function toggle(id) {
    return request({
        url: `${url}/${id}/toggle`,
        method: "put",
        data: {}
    });
}
/**
 * 启用/停用
 * @param id
 */
export function getCommonData() {
    return request({
        url: `${url}/commonData`,
        method: "get",
        data: {}
    });
}
