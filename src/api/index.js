//项目里所有的请求都汇总在该文件
import myAxios from './myAxios'
import {BASE_URL} from '../config/index'
import {WEATHER_KEY,CITY_CODE} from '../config/index'
import jsonp from 'jsonp'
import {message} from 'antd'
//发起登录请求
//该方法的返回值是一个promise函数
export const reqLogin=(values)=>myAxios.post(`${BASE_URL}/login`,values)
//发起获取商品分类列表请求
export const reqCategoryList=()=>myAxios.get(`${BASE_URL}/manage/category/list`)
//发起新增商品分类请求
export const reqAddCategory=(categoryName)=>myAxios.post(`${BASE_URL}/manage/category/add`,{categoryName})
//发起更新修改商品分类请求
export const reqUpdateCategory=(categoryId,categoryName)=>myAxios.post(`${BASE_URL}/manage/category/update`,{categoryId,categoryName})
//请求商品分页列表
export const reqProductPages=(pageNum,pageSize)=>myAxios.get(`${BASE_URL}/manage/product/list`,{params:{pageNum,pageSize}})
//发起更新商品状态请求
export const reqProdStatus=(productId,status)=>myAxios.post(`${BASE_URL}/manage/product/updateStatus`,{productId,status})
//发起搜索商品请求
export const reqProdSearch=(pageNum,pageSize,keyWord,searchType)=>
{//不加[]的话相当于给服务器传了一个key为searchType,value为keyword的键值对
   return myAxios.get(`${BASE_URL}/manage/product/search`,{params:{pageNum,pageSize,[searchType]:keyWord}})}
//根据商品id获取商品信息
export const reqProdDetail=(productId)=>myAxios.get(`${BASE_URL}/manage/product/info`,{params:{productId}})
//根据图片唯一名删除图片
export const reqDeleteImg=(name)=>myAxios.post(`${BASE_URL}/manage/img/delete`,{name})
//发起添加商品请求
export const reqAddProd=(product)=>myAxios.post(`${BASE_URL}/manage/product/add`,{...product})
//请求修改商品信息
export const reqUpdateProd=(product)=>myAxios.post(`${BASE_URL}/manage/product/update`,{...product})
//请求所有角色列表
export const reqAllRole=()=>myAxios.get(`${BASE_URL}/manage/role/list`)
//发起添加角色请求
export const reqAddRoler=(roleName)=>myAxios.post(`${BASE_URL}/manage/role/add`,{roleName})
//发起授权请求
export const reqUpdareRoler=(roleobj)=>myAxios.post(`${BASE_URL}/manage/role/update`,{...roleobj,auth_time:Date.now()})
//发起获取所有用户列表请求
export const reqAllUser=()=>myAxios.get(`${BASE_URL}/manage/user/list`)
//发起添加用户请求
export const reqAddUsers=(userObj)=>myAxios.post(`${BASE_URL}/manage/user/add`,{...userObj})
//发起更新用户请求
export const reqUserUpdae=(userobj)=>myAxios.post(`${BASE_URL}/manage/user/update`,{...userobj})
//发起删除用户请求
export const reqDeleteUser=(userId)=>myAxios.post(`${BASE_URL}/manage/user/delete`,{userId})
//发起获取实况天气请求（高德api）
export const reqWeather=()=>{
return new Promise((resolve,reject)=>{
  jsonp(`https://restapi.amap.com/v3/weather/weatherInfo?key=${WEATHER_KEY}&city=${CITY_CODE}&extensions=base`,(err,data)=>{
    if(err){
       message.error('天气获取失败',1)
       return new Promise(()=>{})
    }else{
       resolve(data)
    }
})
})
}
