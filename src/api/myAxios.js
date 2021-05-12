import axios from 'axios'
import qs from 'querystring'
import {message} from 'antd'
import NProgress from 'nprogress'
import store from '../redux/store.js'
import { createDeleteUserInfoAction } from '../redux/actions/login'
import 'nprogress/nprogress.css'
const instance=axios.create({
  timeout:5000
})
//请求拦截器
instance.interceptors.request.use(function (config) {
  NProgress.start()
  //从store中获取之前保存的token
  const {token}=store.getState().userInfo
  //向请求头中添加token，用于校验身份
  if(token){
    config.headers.Authorization='atguigu_'+token
  }
  if(config.method.toUpperCase()==='POST'){
    //post请求在这里统一处理参数
    config.data=qs.stringify(config.data)
  }
  return config;
});
//响应拦截器
instance.interceptors.response.use(function (response) {
  NProgress.done()
  return response.data;
  
}, function (error) {
  //在这里判断错误返回的状态码为多少，如果是401,说明请求有问题（token出错,没权限），打回登录页面
  if(error.response.status===401){
    message.error('身份校验失败，请重新登录',1);
    store.dispatch(createDeleteUserInfoAction())
  }else{
    message.error(error.message,1);
  }
  NProgress.done()
  return Promise.reject();
});
export default instance