import React, { Component } from 'react'
import {connect} from 'react-redux'
import { Form, Input, Button,message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {Redirect} from 'react-router-dom'
import {createUserInfoAction} from '../../redux/actions/login'
import {reqLogin} from '../../api/index'
import './css/login.less'
import logo from '../../static/imgs/logo.png'
//普通写法
// export default connect(
//   state=>({userInfo:state.userInfo}),{
    //操作login的方法
//   saveUserInfo:createUserInfoAction
//   }
// )(Login)

//es6装饰器写法

@connect(state=>({userInfo:state.userInfo}),{saveUserInfo:createUserInfoAction})
class Login extends Component {
  // componentDidMount(){
  //   console.log(this.props)
  // }
  onFinish = async (values) => {
     const result=await reqLogin(values)
     if(result.status===1){
      message.error(result.msg,1);
     }else{
       //登录成功，返回token,通过token跳转到admin页面
       this.props.saveUserInfo(result)
       //这里必须先保存再跳转，不然数据无法带给admin页面
       this.props.history.replace('/admin/home')
     }
  }
  render() {
    const {isLogin} = this.props.userInfo
    if(isLogin){
      return <Redirect to='/admin/home'></Redirect>
    }
    return (
      <div className='login'>
        <header>
          <img src={logo} alt="logo" />
          <h1>商品管理系统</h1>
        </header>
        <section>
          <h1>用户登录</h1>
    <Form  name="normal_login"
      className="login-form" onFinish={this.onFinish}>
        {/*
        1、用户名必须输入
        2、长度为4-12
        3、由数字字母下划线组成
        */}
      <Form.Item name="username" rules={[
          {
            required: true,
            message: '请输入您的用户名!',

          },
          {
            min:4,message:'用户名最小长度为4位'
          },{
            max:12,message:'用户名最大长度为12位'
          },
          {pattern:/^[a-zA-Z0-9_]{1,}$/,message:'用户名由数字、字母、下划线组成'}
        ]}>
        <Input prefix={<UserOutlined style={{color:'rgba(0,0,0,0.25)'}} className="site-form-item-icon"/>}
         placeholder="账号" />
      </Form.Item>
      <Form.Item name="password"  rules={[
          {
            validator(_,value){
              if(value){
                if(value.length<4){
                  if(!(/^[a-zA-Z0-9_]{1,}$/).test(value)){
                    return Promise.reject(new Error('密码最小长度为4位且密码由数字、字母、下划线组成'))
                  }else{return Promise.reject(new Error('密码最小长度为4位'))}
                }
                if(value.length>12){
                  if(!(/^[a-zA-Z0-9_]{1,}$/).test(value)){
                    return Promise.reject(new Error('密码最大长度为12位且密码由数字、字母、下划线组成'))
                  }else{return Promise.reject(new Error('密码最大长度为12位'))}
                }
                if(!(/^[a-zA-Z0-9_]{1,}$/).test(value)){
                  return Promise.reject(new Error('密码由数字、字母、下划线组成'))
                }
                else{return Promise.resolve()}
              }else{
                return Promise.reject(new Error('请输入密码！'))
              }
            }
          },
        ]}>
        <Input
          prefix={<LockOutlined style={{color:'rgba(0,0,0,0.25)'}} className="site-form-item-icon"/>}
          type="password"
          placeholder="密码"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button login-button">
          登录
        </Button>
      </Form.Item>
    </Form>
        </section>
      </div>
    )
  }
}
export default Login
