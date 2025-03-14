import request from '@/plugins/axios.ts'
const api = ''

export function upload(obj) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data: obj
  })
}


export function login(obj) {
  return request({
    url: '/login',
    method: 'post',
    data: obj
  })
}


