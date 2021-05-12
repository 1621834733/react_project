import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout} from 'antd'
import { createDeleteUserInfoAction } from '../../redux/actions/login'
import Header from './header/index'
import Leftnav from '../admin/leftnav/index'
import Home from '../../component/home/home'
import Category from '../category/category'
import Line from '../line/line'
import Bar from '../bar/bar'
import Pie from '../pie/pie'
import Product from '../product/product'
import Add from '../product/add_update'
import Detail from '../product/detail'
import Role from '../role/role'
import User from '../user/user'
import './css/admin.less'
const { Footer, Sider, Content } = Layout;
@connect(
  state => ({ userInfo: state.userInfo }),
  { deleteUserInfo: createDeleteUserInfoAction }
)
class Admin extends Component {
  render() {
    //在render里要实现跳转，最好使用direct
    const { isLogin } = this.props.userInfo
    if (!isLogin) {
      // this.props.history.replace('/login')
      return <Redirect to='/login'></Redirect>
    }
    return (
      //用antd布局 
      <Layout className='admin'>
        <Sider className='sider'>
          <Leftnav/>
        </Sider>
        <Layout>
          <Header></Header>
          <Content className='content'>
            {/*这里通过路由展示信息*/}
            <Switch>
              <Route path='/admin/home' component={Home}></Route>
              <Route path='/admin/prod_about/category' component={Category}></Route>
              <Route path='/admin/prod_about/product' component={Product} exact></Route>
              <Route path='/admin/prod_about/product/add_update' component={Add} exact></Route>
              <Route path='/admin/prod_about/product/add_update/:id' component={Add}></Route>
              <Route path='/admin/prod_about/product/detail/:id' component={Detail}></Route>
              <Route path='/admin/user' component={User}></Route>
              <Route path='/admin/role' component={Role}></Route>
              <Route path='/admin/charts/bar' component={Bar}></Route>
              <Route path='/admin/charts/line' component={Line}></Route>
              <Route path='/admin/charts/pie' component={Pie}></Route>
              <Redirect to='/admin/home'></Redirect>
            </Switch>
            
          </Content>
          <Footer className='footer'>
            推荐使用谷歌浏览器,以获取最佳页面体验
          </Footer>
        </Layout>
      </Layout>
    )
  }
}
export default Admin
// export default connect(
//   state => ({ userInfo: state.userInfo }),
//   {deleteUserInfo:createDeleteUserInfoAction}
// )(Admin)
