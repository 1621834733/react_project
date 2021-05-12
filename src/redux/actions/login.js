import {SAVE_USER_INFO,DELETE_USER_INFO} from '../constant'
export const createUserInfoAction=(data)=>{
//在这里将服务器返回的数据保存到浏览器，从而实现七天免登录效果
//localStorage里的每一项都是JSON字符串类型，不能传对象，因此要将对象转为字符串
localStorage.setItem("user",JSON.stringify(data.data.user))
localStorage.setItem("token",data.data.token)
  return {type:SAVE_USER_INFO,data}
}
export const createDeleteUserInfoAction=()=>{
  //在这里删除store里的用户数据，从而实现退出登录效果
  //localStorage里的每一项都是JSON字符串类型，不能传对象，因此要将对象转为字符串
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    return {type:DELETE_USER_INFO}
  }