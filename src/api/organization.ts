import request from '@/plugins/axios.ts'
const api = ''

export function add(obj) {
  return request({
    url: '/office/addOffice',
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
    url:'/office/deleteOffice',
    method: 'post',
    data: obj
  })
}

export function update(obj) {
  return request({
    url: '/office/updateOffice',
    method: 'post',
    data: obj
  })
}

export function move(obj) {
  return request({
    url: '/office/moveOffice',
    method: 'post',
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
