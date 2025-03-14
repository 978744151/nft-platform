export interface useTableData<T = any, D = any> {
  listLoading?: boolean
  props?: D
  page: {
    currentPage: Number
    pageSize: Number
    total: Number
  }
  getList: string
  postUrl: string
  putUrl?: string
  delUrl?: string
  postMethod?: string
  putMethod?: string
  delMethod?: string
  list?: T,
}

export interface useTreeData<T = any, D = any> {
  listLoading: boolean
  getList: string
  postUrl: string
  putUrl: string
  delUrl: string
  list: T,
  loadList: D[],
  postMethod?: string
  putMethod?: string
  delMethod?: string
}

export interface getListType<T = any, D = any> {

}