import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Card,Button, Table, Space,message,Modal,Input,Form,Tree} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import {PAGESIZE} from '../../config/index'
import {reqAllRole,reqAddRoler, reqUpdareRoler} from '../../api/index'
import menuList from '../../config/menu_config'
const treeData=[
  {
    title: '平台功能', // 菜单标题名称
    key: 'top', // 对应的path
    children:[...menuList]
  }
]

@connect((state)=>({user:state.userInfo}),{
})
class Role extends Component {
  formRef = React.createRef();

  state={data:[],loading:false,isAddModalVisible:false,isModalVisible:false,checkedKeys:[],_id:'',username:''}
  //获取角色列表请求
  reqRole=async()=>{
   let result=await reqAllRole()
   const {data,status,msg}=result
   if(status===0){
     let newData=data.reverse()
    this.setState({data:newData})
   }else{message.error(msg)}
   
  }
  componentDidMount(){
  this.reqRole()
  }
  //打开添加人员界面
  isAddModalVisible=()=>{
    this.setState({isAddModalVisible:true})
    //setState是异步的
  }
  //打开修改权限界面
  isPublishModalVisible=(record)=>{
  return ()=>{
    const {_id}=record
    this.setState({isModalVisible:true,_id,checkedKeys:record.menus})
  }
  }
  //控制新增的确定
handleOk = () => {
      this.formRef.current.validateFields().then(   
        //拿到input输入框的值
       async(values)=>{
        let result= await reqAddRoler(values.input)
        const {status,msg}=result
        if(status===0){
        message.success('新增角色成功')
         this.reqRole()
         this.setState({isAddModalVisible:false})
         this.formRef.current.resetFields();
        }else{
          message.error(msg)
        }
       }
      ).catch((error)=>{})//校验不通过则终端promise链
      }
  //控制新增的取消
handleCancel=()=>{
  this.setState({isAddModalVisible:false})
  this.formRef.current.resetFields();
}
  //控制修改权限的取消
handlePublishCancel=()=>{
  this.setState({isModalVisible:false})
}
 //控制修改权限的确定
handlePublishOk = async() => {
  const {_id,checkedKeys}=this.state
  const {username}=this.props.user.user
  this.setState({isModalVisible:false,_id,checkedKeys,username})
  let auth={_id,menus:checkedKeys,auth_name:username}
  let result = await reqUpdareRoler(auth)
  const {msg ,status}=result
  if(status===0){
      message.success('授权成功')
      this.reqRole()
  }else{
    message.error(msg)
  }
  
}
 onCheck = (checkedKeys, info) => {
   this.setState({checkedKeys})
};

  render() {
    const data = this.state.data
    // const data= [
    // {
    //   menus:['role','bar','home','category'],
    //   _id:'dasdasdsadasdsa',
    //   name:'林立坚',
    //   create_time:'now',
    //   auth_time:'now',
    //   auth_name:'林立坚按',
    // }
    // ]
    const columns = [
      {
        title: '角色名称',
        //通过dataIndex匹配数据里name的值
        dataIndex: 'name',
        key: 'name',
        align:'left'
      },
      {
        title: '创建时间',
        //通过dataIndex匹配数据里name的值
        dataIndex: 'create_time',
        key: 'create_time',
        align:'left',
        width:'25%',
        render(item){
          return dayjs(item).format('YYYY-MM-DD-HH:mm:ss')
        }
      },
      {
        title: '授权时间',
        //通过dataIndex匹配数据里name的值
        dataIndex: 'auth_time',
        key: 'auth_time',
        align:'left',
        width:'25%',
        render(item){
          return item?dayjs(item).format('YYYY-MM-DD-HH:mm:ss'):''
        }
      },
      {
        title: '授权人',
        //通过dataIndex匹配数据里name的值
        dataIndex: 'auth_name',
        key: 'auth_name',
        align:'left'
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            //text参数表示dataIndex对应的项的值，record为整个data对象
          <Space size="middle">
            {/* <a>Invite {record.name}</a> */}
            <Button type='link' onClick={this.isPublishModalVisible(record)}>设置权限</Button>
          </Space>
        ),
        width:'20%',
        align:'center'
      },
    ]
    return (
      
    // eslint-disable-next-line
<Card 
    // title="Default size card" 
    // eslint-disable-next-line
    title={<Button type='primary' onClick={this.isAddModalVisible}><PlusOutlined/><span>新增角色</span></Button>}
    style={{ width:'100%'}}>
     <Table 
     columns={columns} 
     dataSource={data}
     bordered
     loading={this.state.loading}
     rowKey='_id'
     pagination={{
      defaultPageSize:PAGESIZE,
      showQuickJumper:true,
     }}
      />
     {/*
      控制新增角色的弹窗
     */}
   <Modal 
       title='新增角色'
       visible={this.state.isAddModalVisible} 
       onOk={this.handleOk} 
       onCancel={this.handleCancel}
       cancelText='取消'
       okText='确定'
       forceRender={true}
   >
  <Form  ref={this.formRef} name="control-ref">
    <Form.Item
      name="input"
      rules={[
        {
          required: true,
          message: '角色名必须输入!',

        },
        {pattern:/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,}$/gm,message:'角色名非法，请检查后重新输入'}
      ]}
    >
      <Input placeholder='请输入角色名'/>
    </Form.Item>
  </Form>
   </Modal> 
 {/*
    修改权限的弹窗
  */}
   <Modal 
       title='设置权限'
       visible={this.state.isModalVisible} 
       onOk={this.handlePublishOk} 
       onCancel={this.handlePublishCancel}
       cancelText='取消'
       okText='确定'
       forceRender={true}
   >
     <Tree
      checkable
      defaultExpandedKeys={['0-0-0', '0-0-1']}
      checkedKeys={this.state.checkedKeys}
      onCheck={this.onCheck}
      treeData={treeData}
      defaultExpandAll='true'
    />
   </Modal>
</Card>
    )
  }
}
export default Role
