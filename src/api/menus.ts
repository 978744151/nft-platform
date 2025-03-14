import request from '@/plugins/axios.ts'
const api = ''

export function add(obj) {
  return request({
    url: '/resource/addResource',
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
    url:'/resource/deleteResource',
    method: 'post',
    data: obj
  })
}

export function update(obj) {
  return request({
    url: '/resource/updateResource',
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