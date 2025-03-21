import axios from "axios";
import gAxios from '@/plugins/g-axios'
import Cookies from 'js-cookie';
import { ElNotification } from 'element-plus'
import { getStore } from "./store";
const configMethods = {
    baseURL: import.meta.env.VITE_URL_API,
    token: import.meta.env.VITE_TOKEN,
    request: () => { }}
const request = gAxios(configMethods)
console.log(request)
//     let fetcher =  async ({
//     url, // 接口地址
//     method, // 请求方法 get、post、put、delete
//     data, // 请求数据
//     responseType,
//     config, // 其他配置
//     headers // 请求头
//   }: any) => {
//     config = config || {};
//     config.withCredentials = true;
//     responseType && (config.responseType = responseType);

//     if (config.cancelExecutor) {
//       config.cancelToken = new (axios as any).CancelToken(
//         config.cancelExecutor
//       );
//     }
//     if(config.responseType){}
//     config.headers = {Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZDI3ZDlhNGIzM2Y5ZTQ1NGNhOGEzNSIsIm5hbWUiOiLpmYhUIiwiaWF0IjoxNzQxODQ3OTczLCJleHAiOjE3NDQ0Mzk5NzN9.x3MMpados8MhR79-1bvv57X4LQccZ-w9HijWKjS4pFM'  };
//     if (method !== 'post' && method !== 'put' && method !== 'patch') {
//       if (data) {
//         config.params = data;
//       }
     
//       const reponse = {data:{},status:0}
//       reponse.data  = await request({url,method:'get',params:config.params})
//       console.log(reponse.data)
//       reponse.status  = 0
//       return reponse
//     } else if (data && data instanceof FormData) {
//       config.headers = config.headers || {};
//       config.headers['Content-Type'] = 'multipart/form-data';
//     } else if (
//       data &&
//       typeof data !== 'string' &&
//       !(data instanceof Blob) &&
//       !(data instanceof ArrayBuffer)
//     ) {
//       data = JSON.stringify(data);
//       config.headers = config.headers || {};
//       config.headers['Content-Type'] = 'application/json';
//     }
//     const res = await (axios as any)[method](url, data, config)
//     console.log(res)
    
//     if(res.data.resultCode !== '0'){
//       ElNotification.error(res.data.msg)
//     }else{
//       ElNotification.success('操作成功')
//     }
//     if(!res.data.resultData){
//       return {}
//     }
//     return res.data.resultData
//   }
let fetcher =  async ({
    url, // 接口地址
    method, // 请求方法 get、post、put、delete
    data, // 请求数据
    responseType,
    config, // 其他配置
    headers // 请求头
  }: any) => {
    config = config || {};
    config.withCredentials = true;
    responseType && (config.responseType = responseType);

    if (config.cancelExecutor) {
      config.cancelToken = new (axios as any).CancelToken(
        config.cancelExecutor
      );
    }
    if(config.responseType){}
    config.headers = {Authorization: 'Bearer '+getStore({name: 'token'})  };
    if (method !== 'post' && method !== 'put' && method !== 'patch') {
      if (data) {
        config.params = data;
      }
     
      const reponse = {data:{},status:0}
      reponse.data  = (await (axios as any)[method](url, config)).data
      reponse.status  = 0
      console.log(reponse)
      return reponse
    } else if (data && data instanceof FormData) {
      config.headers = config.headers || {};
      config.headers['Content-Type'] = 'multipart/form-data';
    } else if (
      data &&
      typeof data !== 'string' &&
      !(data instanceof Blob) &&
      !(data instanceof ArrayBuffer)
    ) {
      data = JSON.stringify(data);
      config.headers = config.headers || {};
      config.headers['Content-Type'] = 'application/json';
    }
    console.log(url, data, config)
    const res = await axios[method](url, data, config)
    console.log(res.data)
    
    if(!res.data.success){
      ElNotification.error(res.data.error)
    }else{
        res.data.status = 0
        // res.data.data = res.data
        ElNotification.success('操作成功')
    }
    
    if(!res.data){
      return {}
    }
    console.log(res.data)
    return res.data
  }
export default fetcher