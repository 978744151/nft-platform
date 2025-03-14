import request from '@/plugins/axios.ts'
const api = ''

export function add(obj) {
  return request({
    url: '/app/addApp',
    method: 'post',
    data: obj
  })
}


export function getList(params) {
  return request({
    url: '/app/getAppList',
    method: 'get',
    params
  })
}

export function del(obj) {
  return request({
    url:'/app/deleteApp',
    method: 'post',
    data: obj
  })
}

export function update(obj) {
  return request({
    url: '/app/updateApp',
    method: 'post',
    data: obj
  })
}



export function getDetail(params) {
  return request({
    url: '/app/getDetailById',
    method: 'get',
    params
  })
}