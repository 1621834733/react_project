import React, { Component } from 'react'
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {BASE_URL} from '../../config/index'
import {reqDeleteImg} from '../../api/index'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default class Picture_wall extends Component {
  state = {
    previewVisible: false,//是否展示预览窗口
    previewImage: '',//预览的图片地址
    previewTitle: '',//预览标题
    fileList: [

    ],
  };
  getImgArr=()=>{
    let result =[]
    this.state.fileList.forEach((item)=>{
          result.push(item.name)
    })
    return result;
  }
  setFileList=(imgArr)=>{
     let fileList=[]
     imgArr.forEach((item,index)=>{
        fileList.push({uid:-index,name:item,url:`${BASE_URL}/upload/${item}`})
     })
     this.setState({fileList})
  }
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
//图片状态发生改变的时候调用
  handleChange = async({file, fileList }) => {
    if(file.status==='done'){
      fileList[fileList.length-1].url=file.response.data.url
      fileList[fileList.length-1].name=file.response.data.name
    }
    if(file.status==='removed'){
      let result= await reqDeleteImg(file.name)
      console.log(result)
    }
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
      <Upload
        action={`${BASE_URL}/manage/img/upload`}
        method='post'
        name='image'
        listType="picture-card"
        fileList={fileList}
        onPreview={this.handlePreview}
        onChange={this.handleChange}
      >
        {fileList.length >= 4 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={this.handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
    )
  }
}
