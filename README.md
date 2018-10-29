# 后台管理模版

`src/libs` 第三方库部分源码已经调整过，请科学使用

### 主要内容

- 框架常用页面示例
- 框架常用css样式示例
- 常用第三方库示例

### gulp任务

npm安装过慢可镜像taobao仓库
```bash
npm config set registry https://registry.npm.taobao.org
npm config list # 查看配置
```
任务可查看gulpfile.js文件，如不熟悉gulp可忽略

### 目录结构
```
├── src  资源文件
│   ├── css  css目录
│   │   ├── skins  皮肤css
│   │   ├── app.css  自定义css
│   │   └──   
│   ├── fonts  自定义字体文件(常用字体如awesome在libs)
│   ├── images   图片资源
│   │   less   less/css代码块
│   ├── js   常用js文件
│   └── libs   第三方公用库,有官方文档的注明链接，无则注明使用方法
│
└── views   html类文件,目录层次随项目
```
