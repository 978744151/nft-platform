import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { ElMessage } from 'element-plus'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import type { newAxiosRequestConfig, interConfigMethods } from './typed'
import Cookies from 'js-cookie';
const axiosInstall = (configMethods: interConfigMethods, resolve?: any) => {

    axios.defaults.timeout = 60000

    axios.defaults.validateStatus = function (status: number) {
        return status >= 200 && status <= 500 // 默认的
    }

    axios.defaults.withCredentials = true // 跨域请求时发送Cookie

    const baseRequestConfig: AxiosRequestConfig = {
        baseURL: configMethods.baseURL
    }

    const instancs = axios.create(baseRequestConfig)
    instancs.interceptors.request.use(
        (config: newAxiosRequestConfig) => {
            NProgress.start()
            const token: string = Cookies.get(configMethods.token)
            if (token) {
                config.headers['Authorization'] = token // token
            }
            configMethods.request()
            return config
        },
        (error: AxiosError) => {
            ElMessage({
                message: '未知错误,请联系管理员',
                type: 'error',
            })
            return Promise.reject(error)
        }
    )
    instancs.interceptors.response.use(
        async (res: AxiosResponse) => {
            NProgress.done()
            const asyncRes = await resolve(res)
            return asyncRes
        },
        (error: any) => {
            NProgress.done()
            ElMessage({
                message: '未知错误,请联系管理员',
                type: 'error',
            })
            return Promise.reject(new Error(error))
        },
    )
    return instancs
};


export default axiosInstall

