import request from '@/plugins/axios.ts'

export function add(obj) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data: obj
  })
}

export function disableUser(obj) {
  return request({
    url: '/user/disableUser',
    method: 'post',
    data: obj
  })
}

export function enableUser(obj) {
  return request({
    url: '/user/enableUser',
    method: 'post',
    data: obj
  })
}


export function update(obj) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data: obj
  })
}

export function deleteUser(obj) {
  return request({
    url: '/user/deleteUser',
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

export function getDetail(params) {
  return request({
    url: '/user/getUserDetail',
    method: 'get',
    params
  })
}

export function del(id) {
  return request({
    url:'/admin/menu/' + id,
    method: 'delete'
  })
}

export function put(obj) {
  return request({
    url: '/admin/menu',
    method: 'put',
    data: obj
  })
}

export function getTree(params) {
  return request({
    url: '/office/getOfficeTreeList',
    method: 'get',
    params
  })
}

export function updatePassword(data) {
  return request({
    url: '/user/updatePassword',
    method: 'post',
    data
  })
}

// 获取企业微信用户
export function getWeComUserList(params) {
  return request({
    url: '/user/getWeComUserList',
    method: 'get',
    params
  })
}

// 获取企业微信部门
export function getWeComOfficeList(params) {
  return request({
    url: '/office/getWeComOfficeList',
    method: 'get',
    params
  })
}

// 全量同步被森用户
export function syncAllItalentUser(params) {
  return request({
    url: '/user/syncAllItalentUser',
    method: 'post',
    params
  })
}

// 同步被森用户
export function syncItalentUser(params) {
  return request({
    url: '/user/syncItalentUser',
    method: 'post',
    params
  })
}


// 同步被森用户
export function syncAllOffice(params) {
  return request({
    url: '/office/syncAllOffice',
    method: 'get',
    params
  })
}
// /user/getUserPermissionIdentitie
export function getUserPermissionIdentitie(params) {
  return request({
    url: '/user/getUserPermissionIdentities',
    method: 'get',
    params
  })
}

