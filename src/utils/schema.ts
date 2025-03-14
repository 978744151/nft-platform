import * as RoleApi from '@/api/log'

const getSchema = async(queryParams) => {
  const data = await RoleApi.getList(queryParams)
  return data.amisJson
}

export {getSchema}