import request from '@/plugins/axios.ts'
const api = ''

export function add(obj) {
  return request({
    url: '/role/addRole',
    method: 'post',
    data: obj
  })
}


export function getList(id) {
  return request({
    url: '/office/getOfficeTreeList',
    method: 'get',
    params
  })
}

export function del(obj) {
  return request({
    url:'/role/deleteRole',
    method: 'post',
    data: obj
  })
}

export function update(obj) {
  return request({
    url: '/role/updateRole',
    method: 'post',
    data: obj
  })
}



export function getDetail(params) {
  return request({
    url: '/role/getDetail',
    method: 'get',
    params
  })
}

export function getAllResourceList(params) {
  return request({
    url: '/resource/getAllResourceList',
    method: 'get',
    params
  })
}

export function getAllResourceListWithPermission(params) {
  return request({
    url: '/resource/getAllResourceListWithPermission',
    method: 'get',
    params
  })
}

export function getResourceListByRoleIdAndAppId(params) {
  return request({
    url: '/resource/getResourceListByRoleIdAndAppId',
    method: 'get',
    params
  })
}

export function getUserRoles(params) {
  return request({
    url: '/userRole/getUserRoles',
    method: 'get',
    params
  })
}

export function grantRole(data) {
  return request({
    url: '/userRole/grantRole',
    method: 'post',
    data
  })
}


export function revokeRole(data) {
  return request({
    url: '/userRole/revokeRole',
    method: 'post',
    data
  })
}
export function batchGrantRole(data) {
  return request({
    url: '/userRole/batchGrantRole',
    method: 'post',
    data
  })
}


