import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card,Button,Select,Input ,Table,message} from 'antd';
import {PlusOutlined} from '@ant-design/icons'
import {reqProductPages,reqProdStatus,reqProdSearch} from '../../api/index'
import {PRODPAGESIZE} from '../../config/index'
import saveProdDetail from '../../redux/actions/prod'
const { Option } = Select;
@connect(()=>({}),{
saveProduct:saveProdDetail
})
class Product extends Component {
  state={data:[],loading:true,total:1,current:1,keyword:'',searchtype:'productName'}
  //发送获取商品分页请求
  req=async (num=1)=>{
    if(!this.state.keyword){
      let result=await reqProductPages(num,PRODPAGESIZE)
      const {list,total}=result.data
      this.setState({data:list,loading:false,total,current:num})
      this.props.saveProduct(list)
    }else{
      // 发起搜索请求
       this.search(num)
    }
  }
  componentDidMount(){
    this.req()
  }
  upDateProdStatus=(item)=>{
      return async()=>{
        let {_id,status}=item
        status===1?status=2:status=1
          let result=await reqProdStatus(_id,status)
         if(result.status===0){
           this.req(this.state.current)
           message.info('更新商品状态成功')
         }else{
           message.error(result.msg)
         }
      }
  }
  search=async (num=1)=>{
     const{searchtype,keyword}=this.state
     let result=await reqProdSearch(num,PRODPAGESIZE,keyword,searchtype)
     let {list,total}=result.data
     this.setState({data:list,total,current:num})
     this.props.saveProduct(list)
  }
  render() {
    const dataSource = this.state.data
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        width:'18%'
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        render:(price)=>{
              return `￥${price}`
        },
        align:'center',
        width:'10%'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render:(status,item)=>{
          return (<div>
                    <Button 
                    type={status===1?'danger':'primary'}
                    onClick={this.upDateProdStatus(item)}
                    >
                      {status===1?'下架':'上架'}</Button><br/>
                    <span style={{fontSize:'5px'}}>{status===1?'在售':'已下架'}</span> 
                  </div>)
        },
        align:'center',
        width:'10%'
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render:(text,item)=>{
          return (<div>
                    <Button type='link' onClick={()=>{this.props.history.push(`/admin/prod_about/product/detail/${item._id}`)}}>详情</Button><br/>
                    <Button type='link' onClick={()=>{this.props.history.push(`/admin/prod_about/product/add_update/${item._id}`)}}>修改</Button>
                  </div>)
        },
        align:'center',
        width:'10%'
      },
    ];
    return (
      <Card title={   
        <>
        <Select defaultValue="productName" style={{ width: 120 }} onChange={(value)=>{this.setState({searchtype:value})}}>
        <Option value="productName">按名称搜索</Option>
        <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input 
        placeholder='关键字' 
        style={{width:'300px',margin:'0px 10px'}}
        allowClear
        onChange={(event)=>{this.setState({keyword:event.target.value})}}
        />
        <Button type='primary' onClick={()=>{this.search()}}>搜索</Button>
       </>
      }
       extra={<Button type='primary' onClick={()=>{this.props.history.push('/admin/prod_about/product/add_update')}}><PlusOutlined/>添加商品</Button>} 
       style={{ width:'100%',height:'100%',overflow:'scroll' }}>
     <Table 
      dataSource={dataSource}
      columns={columns} 
      bordered
      rowKey='_id'
      loading={this.state.loading}
      pagination={{
        defaultPageSize:PRODPAGESIZE,
        showQuickJumper:true,
        total:this.state.total,
        onChange:this.req,
        current:this.state.current
       }}
      />
    </Card>
   
    )
  }
}
export default Product
