import { ElMessage } from 'element-plus'
import { axiosInstall } from 'g-axios'

const configMethods = {
  baseURL: import.meta.env.VITE_URL_API,
  token: import.meta.env.VITE_TOKEN,
  request: () => { }
}

const reslove = async (res) => {
  const { resultCode, resultMsg } = res?.data
  console.log(resultCode)
  if (resultCode !== "0") {

    if (resultCode === '6') {
      ElMessage({
        message: '登录失效,请重新登录',
        type: 'error',
      })
      window.microApp.dispatch({ name: "redirectToCAS" });
      return Promise.reject(new Error(res?.data.resultMsg))
    }
    ElMessage({
      message: res?.data.resultMsg || '未知错误,请联系管理员',
      type: 'error',
    })
    return Promise.reject(new Error(res?.data.resultMsg))
  }
  return res
}

export default axiosInstall(configMethods, reslove)