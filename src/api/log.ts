import request from '@/plugins/axios.ts'

export function getList(id) {
  return request({
    url: '/getItalentSyncLogList',
    method: 'get',
    id
  })
}


