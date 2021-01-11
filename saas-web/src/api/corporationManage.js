import request from '@/utils/request'
import { formatParams } from '@/utils/index'

const baseCorporationManageUrl = `/api/app-tenants`
const baseDbInstances = `/api/db-instances`

export function list(query) {
	return request({
		url: `${baseCorporationManageUrl}`,
		method: 'get',
		params: formatParams(query)
	})
}

export function add(data) {
	return request({
		url: `${baseCorporationManageUrl}`,
		method: 'post',
		data: data
	})
}
// 新增并下载授权
export function addAndDownLoad(data) {
	return request({
		url: `${baseCorporationManageUrl}/Create-GenarateAuthorInfo`,
		method: 'post',
		data: data
	})
}

export function getById(id) {
	return request({
		url: `${baseCorporationManageUrl}/${id}`,
		method: 'get',
		params: {}
	})
}

export function update(id, data) {
	return request({
		url: `${baseCorporationManageUrl}/${id}`,
		method: 'put',
		data: data
	})
}
// 新增并下载授权
export function updateAndDownLoad(id, data) {
	return request({
		url: `${baseCorporationManageUrl}/${id}/Update-GenarateAuthorInfo`,
		method: 'put',
		data: data
	})
}

export function disable(id) {
	return request({
		url: `${baseCorporationManageUrl}/${id}/disable`,
		method: 'put',
		data: {}
	})
}

export function enable(id) {
	return request({
		url: `${baseCorporationManageUrl}/${id}/enable`,
		method: 'put',
		data: {}
	})
}

export function getByCode(code) {
	return request({
		url: `${baseCorporationManageUrl}/by-code/${code}`,
		method: 'get',
		params: {}
	})
}

export function getInstances() {
	return request({
		url: `${baseDbInstances}`,
		method: 'get',
		params: ''
	})
}

export function industryCategories() {
	return request({
		url: `${baseCorporationManageUrl}/industryCategories`,
		method: 'get',
		params: ''
	})
}

export function sendEmail(id) {
	return request({
		url: `${baseCorporationManageUrl}/${id}/send-email`,
		method: 'put',
		params: ''
	})
}
