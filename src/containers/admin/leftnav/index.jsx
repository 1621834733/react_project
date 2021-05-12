import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Link,withRouter} from 'react-router-dom'
import {creatTitle} from '../../../redux/actions/admin'
import {Menu} from 'antd'
import menu from '../../../config/menu_config.js'
import './css/index.less'
import logo from '../../../static/imgs/logo.png'
const { SubMenu } = Menu
@connect((state)=>({userInfo:state.userInfo}),{
title:creatTitle
})
@withRouter
class Leftnav extends Component {
  publish=(item)=>{
    const {menus}=this.props.userInfo.user.role
    const username=this.props.userInfo.user.username
      if(username==='admin'){
        return true
      }
      else if(!item.children){
            return menus.find((item2)=>{
                  return item2===item.key
            })
      }
      else if(item.children){
        //item.children为父对象的子数组
        return item.children.some((item2)=>{
          //item2为子数组里的每一项,返回值为布尔值
              return menus.indexOf(item2.key)!==-1
        })
      }
}
  creatMenu=(target)=>{
      return target.map((item)=>{
        if(this.publish(item)){
          if(!item.children){
            return( 
            <Menu.Item key={item.key} icon={item.icon} onClick={()=>{this.props.title(item.title)}}>
            <Link to={item.path}>{item.title}</Link>
            </Menu.Item>
            )
          }else{
            return(
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
                  {this.creatMenu(item.children)}
            </SubMenu>
            )
          }
        }
      })
  }
 
  render() {
    let {pathname}=this.props.location
    return (
      <div>
      <header className='nav-header'>
      <img src={logo} alt='logo'></img>
      <h1>后台管理系统</h1>
      </header>
      <Menu
          //选择哪一个,不要使用默认选择，因为只能匹配一次，而重定向路由的匹配机制是在路由找不到的前提下回到根路由重新匹配
          selectedKeys={ pathname.indexOf('product')!==-1?'product':pathname.split('/').reverse()[0]}
          //默认哪一个打开
          defaultOpenKeys={this.props.location.pathname.split('/').splice(2)}
          mode="inline"
          theme="dark"
      >
         {
            this.creatMenu(menu)
         }
          
           
        </Menu>
      </div>
    )
  }
}
export default Leftnav