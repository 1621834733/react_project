### day 01
* 项目脚手架搭建
* antd按需引入
* redux环境搭建
* 接口测试:postman
### 使用了redux只有容器组件和UI组件的区别
* component容器组卷
* containerUI组件
### 跨域问题
* 在react脚手架中出现跨域问题，可以通过配置代理解决
* 在package.json里添加："proxy":"http://localhost:4000"
### axios中post请求问题
* axios中post请求所携带的参数是json格式，要通过qs库转换且调用qs.stringify()将数据转换为对象，后端才能正常接收数据
### 实现免登录需要借助localStorage
### 状态代码相关
* 401：没有权限访问
* 404：找不到资源
### 在请求拦截器中处理请求头
### 我们只配置了一个代理，要实现对多个服务器的跨域可以配置多个代理或使用jsonp技术
* 值得一提的是，jsonp需要后台配合前端，如果服务端不支持jsonp，则该方法无效
### 在使用api时，遇到一个问题：回调里的返回值无法返回给外侧函数作为返回值，这时考虑使用promise
* 使用高德api时我首先通过配置代理来实现跨域，发现代理就算配置了，通过axios发请求时也无法解决跨域问题，最终发现是axios内部发送请求时会携带一个验证参数，导致跨域失败，因此，在该项目选择jsonp来实现跨域


### 使用的高阶组件与高阶函数：
* connect
* withRouter
### src里引用资源时不能翻出Src

### 使用语义化标签有利于浏览器搜索引擎抓取，即seo优化
### 使用路由组件时，路由有样式用navLink，没有则用Link
### 以下会转化为false

• null undefined
• false
• +0 、 -0 和 NaN
• “”

### 路由重定向是先跳回根路由，再依次匹配到下级路由
### 所有对象的key都是字符串，想读变量用[]，不然会当成自己添加的属性

### 要在react里实现标签渲染，需要借助dangerouslySetInnerHTML={{__html:prod.detail}}属性

### 由于this.setState是异步的，有时候直接读读不到内部的属性，需要将属性挂载到自身，即不要用this.setState({}),而是直接this.xxx

### 上传图片时没有url，需要自己从file.respone里添加url和name（为删除做准备）

### 富文本编辑器wysiwyg what you see is what you get


### jquery树形控件用ztree  ui用户easyUI

### 生产环境刷新后401我猜想是由于后台使用了自定义中间件区处理返回页面