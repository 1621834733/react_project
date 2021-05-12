import {SAVE_USER_INFO,DELETE_USER_INFO} from '../constant'
const user=JSON.parse(localStorage.getItem('user'))
const token=localStorage.getItem('token')
const initState={
  user:user||'',
  token:token||'',
  isLogin:user&&token?true:false
};
export default function login(preState=initState,action) {
  const {type,data}=action;
  switch (type) {
    case SAVE_USER_INFO:
      const{user,token}=data.data
       let newState={user,token,isLogin:true}
      return newState;
    case DELETE_USER_INFO:
      return {user:'',token:'',isLogin:false};
    default:
      return preState;
  }
}