import React, { Component } from 'react'
import {connect} from 'react-redux'
import {reqProdDetail,reqCategoryList} from '../../api/index'
import { Card ,Button, message} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons'
import './css/detail.less'
@connect((state)=>({prodList:state.prod,prodCate:state.prodCate}),{})
class Detail extends Component {
  //在状态的商品列表里加一个空的imgs属性是因为this.setState是异步的，在初始化的时候找不到imgs属性会报错
  state={prod:{imgs:[],categoryId:''},prodCate:{name:''}}
  req=async (id)=>{
    let result= await reqProdDetail(id)
    const {status,data,msg}=result
    if(status===0){
      let prod=data
      this.setState({prod})
    }else{
      message.error(msg)
    }
  }
  reqCate=async ()=>{
    let result=await reqCategoryList()
    if(result.status===0){
      let prodCate=result.data.find((item)=>{
            return item._id===this.state.prod.categoryId
      })
      this.setState({prodCate})
    }else{
      message.error(result.msg)
    }
  }
  componentDidMount(){
    const{id}=this.props.match.params
    //不是通过详情点进来，而是刷新，则需要请求单独获取商品详情
    if(this.props.prodList.length===0){
       this.req(id)
    }else{
      let prod=this.props.prodList.find((item)=>{
        return item._id===id
      })
      //this.setState是异步的，所以直接读读不到id，把id挂载在自身为同步，可以读到
      this.categoryId=prod.categoryId
      //没刷新，直接在redux里找到三条商品列表，find出id相同的那一条
      this.setState({prod})
    }
    if(this.props.prodCate.length!==0){
      //如果有分类列表，拿到分类列表里id相同的一条
      let prodCate=this.props.prodCate.find((item)=>{
        return item._id===this.categoryId
      })
      //把分类列表里符合条件的那一条维持到状态里
      this.setState({prodCate})
    }else{
      //没有先点击分类列表，必须自己请求
     this.reqCate()
    }
  }
  render() {
    return (
    <Card
     title={<>
     <Button type='link' onClick={()=>{this.props.history.goBack()}}><ArrowLeftOutlined/></Button>
     <span style={{margin:'0 -10px'}}>商品详情</span></> }
     style={{ width:'100%',height:'100%',overflow:'scroll' }}>
     <Card.Grid hoverable={false} style={{width:'100%'}}><span className='title'>商品名称:</span>{this.state.prod.name}</Card.Grid>
     <Card.Grid hoverable={false} style={{width:'100%'}}><span className='title'>商品描述:</span>{this.state.prod.desc}</Card.Grid>
     <Card.Grid hoverable={false} style={{width:'100%'}}><span className='title'>商品价格:</span>{this.state.prod.price}</Card.Grid>
     <Card.Grid hoverable={false} style={{width:'100%'}}><span className='title'>商品分类:</span>{this.state.prodCate.name}</Card.Grid>
     <Card.Grid hoverable={false} style={{width:'100%'}}><span className='title'>商品图片:</span>
     {this.state.prod.imgs.map((item,index)=>{
          return <img src={`/upload/`+item} alt='img' key={index} style={{width:'200px'}}/>
     })}
     </Card.Grid>
     <Card.Grid hoverable={false} style={{width:'100%'}}><span className='title'>商品详情:</span>
     <div dangerouslySetInnerHTML={{__html:this.state.prod.detail}}></div>
     </Card.Grid>
    </Card>
    )
  }
}
export default Detail
