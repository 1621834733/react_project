//汇总所有的reducer
import {combineReducers} from 'redux'
import loginReducers from './login'
import adminReducers from './admin'
import prodReducers from './prod'
import prodCate from './prod_cate'
export default combineReducers({
  //对象简写,这里面保存的就是store的state
  userInfo:loginReducers,title:adminReducers,prod:prodReducers,prodCate:prodCate
})
