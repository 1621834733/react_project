import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Card,Button, Table, Space,message,Modal,Input,Form,Select,Popconfirm} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import {PAGESIZE} from '../../config/index'
import {reqAddUsers, reqAllUser,reqUserUpdae,reqDeleteUser} from '../../api/index'
const { Option } = Select;
@connect((state)=>({user:state.userInfo}),{
})
class Role extends Component {
  formRef = React.createRef();
  state={users:[],roles:[],loading:false,isAddModalVisible:false,_id:'',username:'',isPolish:false}
  //获取用户列表请求
  reqUser=async()=>{
  let result=await reqAllUser()
   const {status,msg}=result
   if(status===0){
     let {roles,users}=result.data
     this.setState({roles,users:users.reverse()})
   }else{message.error(msg)}
   
  }
  componentDidMount(){
  this.reqUser()
  }
  //打开创建用户界面
  isAddModalVisible=(record)=>{
    return ()=>{
     if(!record){
      this.setState({isAddModalVisible:true,isPolish:false})
     }else{
      
      const{username,password,email,phone,role_id}=record
      this.setState({isAddModalVisible:true,isPolish:true,username})
      this.formRef.current.setFieldsValue({username,password,email,phone,role_id})
     }
    }
    //setState是异步的
  }

  //控制创建用户的确定
handleOk = () => {
      
      this.formRef.current.validateFields().then(   
      //拿到input输入框的值
      async(values)=>{
      let _id=''
      let name=this.state.username
      let user=[]
      if(this.state.isPolish){
        let one=this.state.users.find((item)=>{
              return item.username===name
        })
        _id=one._id
        let result=await reqUserUpdae({...values,_id})
        const {data,status,msg}=result
        if(status===0){
          this.state.users.map((item)=>{
              if(item._id===_id){
                user.push(data)
              }else{
                user.push(item)
              }
          })
          
        message.success('修改用户信息成功')
      this.setState({isAddModalVisible:false,users:user})
         
        }else{message.error(msg)}
         
     }else{
      let result=await reqAddUsers(values)
      const {data,status,msg}=result
      if(status===0){
        let users=[data,...this.state.users]
        message.success('添加用户成功')
        this.setState({isAddModalVisible:false,users})
        this.formRef.current.resetFields();
      }else{message.error(msg)}
     }
     
       }
      ).catch((error)=>{})//校验不通过则终端promise链
      }
  //控制创建用户的取消
handleCancel=()=>{
  this.setState({isAddModalVisible:false})
}
handleChange=(value)=> {
  console.log(`selected ${value}`);
}
confirm=(record)=> {
  return async()=>{
    let result=await reqDeleteUser(record._id)
    const {status,data,msg}=result
    if(status===0){
      let users=[]
      this.state.users.map((item)=>{
            if(item._id!==record._id){
              users.push(item)
            }
      })
      this.setState({users})
      message.success('删除用户成功')
    }else{
      message.error(msg)
    }
  }
 
}

  render() {
    const data = this.state.users
    const columns = [
      {
        title: '用户名',
        //通过dataIndex匹配数据里name的值
        dataIndex: 'username',
        key: 'username',
        align:'left'
      },
      {
        title: '邮箱',
        //通过dataIndex匹配数据里name的值
        dataIndex: 'email',
        key: 'email',
        align:'left',
        width:'15%'
      },
      {
        title: '电话',
        //通过dataIndex匹配数据里name的值
        dataIndex: 'phone',
        key: 'phone',
        align:'left',
        width:'15%'
      },
      {
        title: '注册时间',
        //通过dataIndex匹配数据里name的值
        dataIndex: 'create_time',
        key: 'create_time',
        align:'left',
        render(item){
              return dayjs(item).format('YYYY-MM-DD-HH:mm:ss')
        }
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        key: 'role_id',
        width:'10%',
        align:'center',
        render:(item)=>{
                let role=this.state.roles.find((one)=>{
                  return one._id===item
                })
                return role.name
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
            //text参数表示dataIndex对应的项的值，record为整个data对象
          <Space size="middle">
            {/* <a>Invite {record.name}</a> */}
            <Button type='link' onClick={this.isAddModalVisible(record)}>修改</Button>
            <Popconfirm
              title="是否确定删除该用户?"
              onConfirm={this.confirm(record)}
              onCancel={this.cancel}
              okText="确定"
              cancelText="取消"
            >
            <Button type='link' >删除</Button>
            </Popconfirm>
          </Space>
        ),
        align:'center'
      },
    ]
    return (
      
    // eslint-disable-next-line
 <Card 
    // title="Default size card" 
    // eslint-disable-next-line
    title={<Button type='primary' onClick={this.isAddModalVisible()}><PlusOutlined/><span>新增用户</span></Button>}
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
      控制创建用户的弹窗
     */}
   <Modal 
       title='新增用户'
       visible={this.state.isAddModalVisible} 
       onOk={this.handleOk} 
       onCancel={this.handleCancel}
       cancelText='取消'
       okText='确定'
       forceRender={true}
   >
  <Form  ref={this.formRef} name="control-ref" >
    <Form.Item
      name="username"
      label='用户名'
      rules={[
        {
          required: true,
          message: '用户名必须输入!',
          
        },
        {
          min:4,message:'用户名最小长度为4位'
        },{
          max:12,message:'用户名最大长度为12位'
        },
        {pattern:/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,}$/gm,message:'用户名非法，请检查后重新输入'}
      ]}
    >
      <Input placeholder='请输入用户名' style={{width:'80%'}}/>
    </Form.Item>
    <Form.Item
      name="password"
      label='密码'
      rules={[
        {
          required: true,
          message: '密码必须输入!',

        },
        {pattern:/^[a-zA-Z0-9_]{1,}$/gm,message:'密码非法，请检查后重新输入'}
      ]}
    >
       <Input placeholder='请输入密码' style={{width:'80%'}}/>
    </Form.Item>
    <Form.Item
      name="phone"
      label='手机号'
      rules={[
        {
          required: true,
          message: '手机号必须输入!',

        },
        {pattern:/^[a-zA-Z0-9]{1,}$/gm,message:'手机号非法，请检查后重新输入'}
      ]}
    >
       <Input placeholder='请输入手机号' style={{width:'80%'}}/>
    </Form.Item>
    <Form.Item
      name="email"
      label='邮箱'
      rules={[
        {
          required: true,
          message: '邮箱必须输入!',
        },
        {pattern:/^[a-zA-Z0-9_]{1,12}@[a-zA-Z0-9]{1,6}.com$/gm,message:'邮箱非法，请检查后重新输入'}
      ]}
    >
       <Input placeholder='请输入邮箱' style={{width:'80%'}}/>
    </Form.Item>
    <Form.Item
      name="role_id"
      label='角色'
      rules={[
        {
          required: true,
          message: '角色必须选择!',
        }
      ]}>
    <Select initialvalues="lucy" style={{ width: '80%' }} onChange={this.handleChange} placeholder="请选择角色">
      {
        this.state.roles.map((item)=>{
            return <Option value={item._id} key={item._id}>{item.name}</Option>
        })
      }
    </Select>
    </Form.Item>
  </Form>
   </Modal>
  
</Card>
    )
  }
}
export default Role
