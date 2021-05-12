import React, { Component } from 'react'
import {connect} from 'react-redux'
import { Card ,Button,Form, Input,Select,message} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons'
import {reqCategoryList,reqProdDetail,reqUpdateProd} from '../../api/index'
import Picture from './picture_wall'
import Richtext from './rich_text_editor'
import {reqAddProd} from '../../api/index'
const { Option } = Select;
@connect((state)=>({prodCate:state.prodCate,prod:state.prod}),{})
class Add_update extends Component {
  formRef = React.createRef();
  state={prodCate:[],name:'',desc:'',price:'',categoryId:'',imgs:[],detail:''}
  reqCategory=async ()=>{
   let result = await reqCategoryList()
   const {status,data,msg}=result
   if(status===0){
      this.setState({prodCate:data})
   }else{
      message.error(msg)
   }
  }
  reqDetail=async(id)=>{
    let result = await reqProdDetail(id)
    const {status,msg}=result
    if(status===0){
       const {name,desc,price,categoryId,imgs,detail}=result.data
       this.formRef.current.setFieldsValue({name,desc,price,categoryId})
       this.picture.setFileList(imgs)
       this.richtext.setRichText(detail)
    }else{
       message.error(msg)
    }
  }
  componentDidMount(){
    const {id}=this.props.match.params
    if(this.props.prodCate.length!==0){
      const prodCate=this.props.prodCate
      //获取商品分类
      this.setState({prodCate})
    }else{
      this.reqCategory(id)
    }
    if(id){
      //修改界面，判断redux里有无商品
      if(this.props.prod.length!==0){
        let prod=this.props.prod.find((item)=>{
              return item._id===id
        })
        const {name,desc,price,categoryId,imgs,detail}=prod
        // this.setState({name,desc,price,categoryId,imgs,detail})
        this.formRef.current.setFieldsValue({name,desc,price,categoryId})
        this.picture.setFileList(imgs)
        this.richtext.setRichText(detail)
      }else{
        this.reqDetail(id)
      } 
    }
  }
  onFinish = async(values) => {
    const _id=this.props.match.params.id
    let imgs=this.picture.getImgArr()
    let detail=this.richtext.getRichText()
    let product=_id?{...values,imgs,detail,_id} :{...values,imgs,detail}
    let result =_id ? await reqUpdateProd(product): await reqAddProd(product)
    const{status,msg}=result
    if(status===0){
      this.props.history.replace('/admin/prod_about/product')
    }else{
      message.error(msg)
    }
  };
  render() {
 
    return (

    <Card 
    title={
    <>
      <Button type='link' onClick={()=>{this.props.history.goBack()}}><ArrowLeftOutlined/></Button>
      <span style={{margin:'0 -10px'}}>{this.props.match.params.id?'商品修改':'商品添加'}</span></> } style={{ width:'100%',height:'100%',overflow:'scroll'}}>
      <Form
      name="basic"
      labelCol={{ offset: 1}}
      onFinish={this.onFinish}
      ref={this.formRef}
    >
      <Form.Item
        label="商品名称"
        name="name"
        rules={[
          {
            required: true,
            message: '请输入商品名称!',
          },
        ]}
      >
        <Input style={{ width: '50%' }}/>
      </Form.Item>
      <Form.Item
        label="商品描述"
        name="desc"
        rules={[
          {
            required: true,
            message: '请输入商品描述!',
          },
        ]}
      >
        <Input style={{ width: '50%' }}/>
      </Form.Item>
      <Form.Item
      label='商品价格'
      name='price'
      rules={[
        {
          required: true,
          message: '请输入商品价格!',
        },
      ]}
      >
      <Input addonBefore="￥" addonAfter="元" type='number' style={{ width: '50%' }}/>
      </Form.Item>
      <Form.Item
       label='商品分类'
       name='categoryId'
       rules={[
         {
           required: true,
           message: '请选择一个商品分类!',
         },
       ]}
      >
        <Select  style={{ width: '50%' }} placeholder='请选择分类'>
          {this.state.prodCate.map((item)=>{
                return(<Option value={item._id} key={item._id}>{item.name}</Option>)
          })}
        </Select>
      </Form.Item>
      <Form.Item
       style={{padding:'0 0 0 12px'}}
       label='商品图片'
       >
         <Picture ref={(picture)=>{this.picture=picture}}/>
      </Form.Item>  
      <Form.Item
       style={{padding:'0 0 0 12px'}}
       label='商品详情'
       >
         <Richtext ref={(richtext)=>{this.richtext=richtext}}/>
      </Form.Item>  
      <Form.Item style={{padding:'0 0 0 24px'}}>
        <Button type="primary" htmlType="submit" >
          提交
        </Button>
      </Form.Item>
    </Form>
    </Card>
    )
  }
}
export default Add_update