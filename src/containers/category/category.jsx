import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Card,Button, Table, Space,message,Modal,Input,Form} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {reqCategoryList,reqAddCategory,reqUpdateCategory} from '../../api/index'
import {PAGESIZE} from '../../config/index'
import {prodCate} from '../../redux/actions/prod_cate'
@connect(()=>({}),{
prodCate:prodCate
})
class Category extends Component {
  formRef = React.createRef();
  state={data:[],loading:true,isModalVisible:false,title:'',publishNode:{}}
  //发起获取商品分类请求
  req=async ()=>{
    let {data,msg}=await reqCategoryList()
    if(data){
      this.setState({data:data.reverse(),loading:false})
      this.props.prodCate(data)
      }else{
        message.error(msg)
    }
  }
  
  componentDidMount(){
    this.req()
  }
  //打开添加分类界面
  isAddModalVisible=()=>{
    this.setState({isModalVisible:true,title:'新增'})
    //setState是异步的
  }
  //打开修改分类界面
  isPublishModalVisible=(record)=>{
  return ()=>{
    this.setState({isModalVisible:true,title:'修改',publishNode:record})
    //input为input输入框的name
    this.formRef.current.setFieldsValue({input:record.name})
  }
  }
  handleOk = () => {
    //判断是新增还是修改
    if(this.state.title==='新增'){
      // // 这里不能用push，因为state只支持纯函数
      this.formRef.current.validateFields().then(
           async (values)=>{
              // console.log(this.formRef.current.getFieldValue('note'))
              let result= await reqAddCategory(values.input)
              if(result.status===0){
                message.success('商品分类添加成功')
                let {data}=this.state
                const {name,_id}=result.data
                let newStyle={name,_id}
                let newData=[newStyle,...data]
                this.setState({data:newData,isModalVisible:false})
                this.formRef.current.resetFields();
              }else{
                message.error(result.msg)
              }
            }
      ).catch((error)=>{})//校验不通过则终端promise链
    }else{
      this.formRef.current.validateFields().then(
        async (values)=>{
          let id=this.state.publishNode._id
          let name=values.input
            let result= await reqUpdateCategory(id,name)
            if(result.status===0){
             message.success('商品分类修改成功')
             //修改后重新拉取商品列表
             this.req()
             this.setState({isModalVisible:false,publishNode:{}})
             this.formRef.current.resetFields();
           }else{
             message.error(result.msg)
           }
         }
   ).catch((error)=>{})//校验不通过则终端promise链
    }
  }
  handleCancel=()=>{
    this.setState({isModalVisible:false})
    this.formRef.current.resetFields();
  }
  render() {
    const data = this.state.data
    const columns = [
      {
        title: '分类名',
        //通过dataIndex匹配数据里name的值
        dataIndex: 'name',
        key: 'name',
        render: text => <Button type='link'>{text}</Button>,
        align:'left'
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            //text参数表示dataIndex对应的项的值，record为整个data对象
          <Space size="middle">
            {/* <a>Invite {record.name}</a> */}
            <Button type='link' onClick={this.isPublishModalVisible(record)}>修改分类</Button>
          </Space>
        ),
        width:'25%',
        align:'center'
      },
    ];
    return (
      
    // eslint-disable-next-line
<Card 
    // title="Default size card" 
    // eslint-disable-next-line
    extra={<Button type='primary' onClick={this.isAddModalVisible}><PlusOutlined/><span>添加</span></Button>} 
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
   <Modal 
       title={`${this.state.title}分类`}
       visible={this.state.isModalVisible} 
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
          message: '分类名必须输入!',

        },
        {pattern:/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,}$/gm,message:'商品分类名非法，请检查后重新输入'}
      ]}
    >
      <Input placeholder='请输入商品分类'/>
    </Form.Item>
  </Form>
   </Modal> 
</Card>
    )
  }
}
export default Category
