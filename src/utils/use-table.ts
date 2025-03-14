import { ElMessageBox, ElNotification } from 'element-plus'
// import { downBlobFile } from '@/util/util'
import Api from '@/api/common'
import type { useTableData } from './types'
export function useTable(data: useTableData, crud) {

  const getList = (params: any = {}) => {
    console.log(params)
    params = Object.assign(params, data.tForm)
    data.listLoading = true
    if (data.props) {
      params = Object.assign(params, data.props)
    }
    return new Promise((resolve: any) => {
      Api.getList(
        Object.assign(
          params,
          {
            pageNum: data.page.currentPage,
            pageSize: data.page.pageSize,
          },
        ),
        data
      ).then((response: any) => {
        data.list = response.data.resultData?.list || response.data.resultData
        data.page.total = response.data.resultData?.total
        data.listLoading = false
        resolve(response)
      })
    })
  }

  const handleFilter = (param: any, done: Function) => {
    data.page.currentPage = 1
    getList(param)
    done && done()
  }

  const handleRefreshChange = (current?: number) => {
    if (current) data.page.currentPage = current
    getList()
    // crud.value.scrollTo(0)
  }
  const sizeChange = (pageSize: number) => {
    data.page.pageSize = pageSize
    handleRefreshChange()
  }
  const currentChange = (current: number) => {
    data.page.currentPage = current
    handleRefreshChange()
  }

  // const deleteRow = async (row: { id: Number }) => {
  //   await Api[data.del || 'del'](row.id)
  //   handleRefreshChange()
  //   ElMessage.success('操作成功')
  // }
  const rowSave = async (form: any, done: Function, loading: Function) => {
    // 
    if (data.props) {
      Object.keys(data.props).map((key: any) => {
        form[key] = form[key] || data.props[key]
      })
    }
    if (typeof form.modelId === 'object') form.modelId = ''
    await Api.post(form, data).then(() => {
      ElNotification({
        title: '',
        message: '操作成功',
        type: 'success'
      })
      done()
      loading()
      handleRefreshChange()
    }).catch(() => {
      // done()
      loading()
    })
  }
  const rowEdit = async (
    form: any,
    index: Number,
    done: Function,
    loading: Function
  ) => {
    if (data.props) {
      Object.keys(data.props).map((key: any) => {
        form[key] = form[key] || data.props[key]
      })
    }
    await Api.put(form, data).then(() => {
      ElNotification({
        title: '',
        message: '操作成功',
        type: 'success'
      })
      loading && loading()
      done && done()
      handleRefreshChange()
    }).catch(() => {
      loading && loading()
      // done && done()
    })
  }
  const download = () => {
    // const fileName = `${row.name}` || '' + new Date().getTime()
    // downBlobFile(data.downloadUrl(row.id), {}, `${fileName}.json`, method)
  }
  const rowDelete = (form: any) => {
    ElMessageBox.confirm('此操作将永久删除该数据 是否继续??', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        await Api.del(form.id, data)
        ElNotification({
          title: '',
          message: '操作成功',
          type: 'success'
        })
        handleRefreshChange()
      })
      .catch(() => { })
  }

  return {
    rowDelete,
    rowEdit,
    handleFilter,
    getList,
    sizeChange,
    handleRefreshChange,
    currentChange,
    rowSave,
    download
  }
}
