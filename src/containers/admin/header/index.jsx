import React, { Component} from 'react'
import {Button, Modal,Space} from 'antd'
import {FullscreenOutlined,FullscreenExitOutlined,ExclamationCircleOutlined } from '@ant-design/icons'
import screenfull from 'screenfull'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import dayjs from 'dayjs'
import {createDeleteUserInfoAction} from '../../../redux/actions/login'
import {reqWeather} from '../../../api/index'
import menu from '../../../config/menu_config'
import './css/index.less'
@connect(state=>({user:state.userInfo,title:state.title}),{
  quit:createDeleteUserInfoAction,
})
/*由于Header是我自己定义的组件，不是路由组件，当他想使用路由组件的api时，需要通过withRouter包裹
  withRouter是高阶组件
  装饰器相当于:
  withRouter(Header)
*/
@withRouter
class Header extends Component {
  state={isFull:false,day:dayjs().format('DD/MM/YYYY'),weather:'晴',temperature:'28',city:'番禺',title:''}
  getWeather=async ()=>{
    const result=await reqWeather()
    const{weather,temperature,city}=result.lives[0]
    this.setState({weather,temperature,city})
  }
  showConfirm=()=> {
    const that =this
    const { confirm } = Modal
    confirm({
      title: '是否退出登录',
      icon: <ExclamationCircleOutlined />,
      content: '如退出需重新登录',
      onOk() {
        that.props.quit()
      },
      onCancel() {
       return;
      },
      okText: '确认',
      cancelText: '取消',
    });
  }
  fullScreen=()=>{
      screenfull.toggle()  
  }
  creatTitle=()=>{
    let {pathname}=this.props.location
    let title=''
    if(pathname.indexOf('product')!==-1){pathname='/admin/prod_about/product'}
    // eslint-disable-next-line 
    menu.map((item)=>{
          if(item.children){
             let children=item.children.find((item)=>{
                      return item.path===pathname
                  })
            //如果找出来对应的项，把标题赋值给数组
                  if(children){
                    title=children.title
                  }
          }else{
            if(item.path===pathname){
                  title=item.title
            }
          }
    })
   this.setState({title})
  }
  componentDidMount(){
    //组件加载完成时绑定全屏与否的监听
    screenfull.on('change',()=>{
      const {isFull}=this.state;
      this.setState({isFull:!isFull})
    })
    this.timer1=setInterval(() => {
          this.setState({day:dayjs().format('YYYY-MM-DD-HH:mm:ss')})
    }, 1000);
    this.timer2=setInterval(() => {
      this.getWeather()
    }, 3600000);
    this.getWeather()
    this.creatTitle()
  }
  componentWillUnmount(){
      clearInterval(this.timer1)
      clearInterval(this.timer2)
  }
  render() {
    
    return (
      <header className='header'>
        <div className='header-top'>
          <Button size='small' onClick={this.fullScreen}>
            {/*
               通过state判断加载哪一个全屏组件
            */}
            {
              this.state.isFull?<FullscreenExitOutlined/>:<FullscreenOutlined/>
            }
          </Button>
          <span className='user-name'>欢迎,{this.props.user.user.username}</span>
          <Space><Button type='link' size='small' className='quit' onClick={this.showConfirm}>退出登录</Button></Space>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>
            {/*
              在这里通过pathname匹配menu.config里对应的项，将titile写入页面
            */}
            {this.props.title?this.props.title:this.state.title}
          </div>
          <div className='header-bottom-right'>
            <span className='weather'>{this.state.day} {this.state.city} {this.state.weather} {`${this.state.temperature}°C`}</span>
          </div>
        </div>
      </header>
    )
  }
}
export default Header