var gulp = require('gulp'); //本地安装gulp所用到的地方
var less = require('gulp-less'); //less编译
var webserver = require('gulp-webserver'); //静态服务(其他选择gulp-connect或livereload)
var concat = require('gulp-concat'); //文件合并
var rename = require('gulp-rename'); //文件重命名
var replace = require('gulp-replace'); //文件正则替换
var autoprefixer = require('gulp-autoprefixer'); //自动处理css浏览器前缀

var uglify = require('gulp-uglify'); //js压缩
var minifyCss = require("gulp-minify-css"); //css压缩
var minifyHtml = require("gulp-minify-html"); //html压缩

var spritesmith = require('gulp.spritesmith'); //精灵图合成
//gulp-file-include 引入公用模块文件
var basedir = '';
var url = require('url');
var fs = require('fs');
var path = require('path');

//定义默认任务
gulp.task('default', ['server'], function() {
  console.info("gulp 已经运行！");
});

//web服务
gulp.task('server', function() {
  gulp.src(basedir).pipe(webserver({
    //port:8000+Math.ceil(Math.random()*90+10),
    port: 8081,
    path: '',
    livereload: true, //自动刷新
    directoryListing: true, //目录列表显示
    open: true, //打开浏览器
    middleware: function(req, res, next) { //模拟json数据
      var urlObj = url.parse(req.url, true),
        method = req.method;

      if (!urlObj.pathname.match(/^\/api/)) { //不是api开头的数据，直接next
        next();
        return;
      }
      var mockDataFile = path.join(__dirname, urlObj.pathname) + ".json";
      //file exist or not
      fs.access(mockDataFile, fs.F_OK, function(err) {
        if (err) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            "status": "404",
            "error": "无法找到文件" + mockDataFile
          }));
          return;
        }
        var data = fs.readFileSync(mockDataFile, 'utf-8');
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
      });
      next();
    },
    fallback: '' //默认打开文件
  }));
});
// 自动监听任务
gulp.task('watch', function() {
  gulp.watch(basedir + 'src/less/*/*.less', ['less']);
  gulp.watch(basedir + 'views/html/*/*.html');
  gulp.watch(basedir + 'src/css/ticket/ticket.css');
  gulp.watch(basedir + 'src/js/*/*.js');
});

//编译Less
gulp.task('less', function() {
  gulp.src(basedir + 'src/less/ticket/ticket.less') //该任务针对的文件
    .pipe(less({
      compress: true
    })) //该任务调用的模块
    .pipe(gulp.dest(basedir + 'src/css/ticket')); //将会在src/css下生成index.css
});

//views 转换任务
gulp.task('tran:cshtml', function() { //将views里html转换成views.cshtml的cshtml
  gulp.src([basedir + 'views/*/*.html', basedir + 'views/*.html']) // 要压缩的css文件
    .pipe(replace(/"\W*src/g, '"@Url.Content("~/")src')) //替换引用路径
    .pipe(rename(function(path) {
      path.extname = ".cshtml"
    }))
    .pipe(gulp.dest(basedir + '_cshtml'));
});
gulp.task('tran:jsp', function() { //将views里html转换成views_jsp的.jsp
  gulp.src([basedir + 'views/*/*.html', basedir + 'views/*.html']) // 要压缩的css文件
    .pipe(replace(/"\W*src/g, 'src')) //替换引用路径
    //.pipe(gulp-header(<%@ page contentType="text/html;charset=UTF-8" language="java" %>))
    .pipe(rename(function(path) {
      path.extname = ".jsp"
    }))
    .pipe(gulp.dest(basedir + '_jsp'));
});

//当图片名以-hover结尾时，自动生成:hover伪类样式
function hoverClass(name) {
  return /-hover$/.test(name) ? name.replace(/-hover$/, ':hover') : name;
}
gulp.task('sprite', function() {
  var spriteData = gulp.src(basedir + 'src/images/ticket/sprite/*.png').pipe(spritesmith({
    imgName: 'sprite.png', //保存合并后图片的地址
    cssName: 'sprite.css', //保存合并后对于css样式的地址，可输出SASS,Stylus,LESS,JSON等格式
    padding: 5, //合并时两个图片的间距
    algorithm: 'binary-tree', //排列规则有：top-down、left-right、diagonal、alt-diagonal、binary-tree
    //cssTemplate:'sprite-temp.css'//精灵图样式模版地址，内置默认模版如下：
    // {{#sprites}}
    //   .icon-{{name}}{
    //   background-image: url("{{escaped_image}}");
    //   background-position: {{px.offset_x}} {{px.offset_y}};
    //   width: {{px.width}};
    //   height: {{px.height}};
    //   }
    // {{/sprites}}
    // 函数定义模版
    cssTemplate: function(data) {
      var arr = [];
      data.sprites.forEach(function(sprite) {
        arr.push('.icon-' + hoverClass(sprite.name) +
          '{\n' +
          'background-image: url("' + sprite.escaped_image + '");\n' +
          'background-position: ' + sprite.px.offset_x + ' ' + sprite.px.offset_y + ';\n' +
          'width:' + sprite.px.width + ';\n' +
          'height:' + sprite.px.height + ';\n' +
          '}\n');
      });
      return arr.join('');
    }
  }));
  spriteData.img.pipe(gulp.dest(basedir + 'src/images/ticket'));
  spriteData.css.pipe(gulp.dest(basedir + 'src/images/ticket/'));
});

//autoFx任务：自动处理css浏览器前缀
// gulp-autoprefixer的browsers参数详解 :https://github.com/ai/browserslist#queries
// last 2 versions: 主流浏览器的最新两个版本
// last 1 Chrome versions: 谷歌浏览器的最新版本
// last 2 Explorer versions: IE的最新两个版本
// last 3 Safari versions: 苹果浏览器最新三个版本
// Firefox >= 20: 火狐浏览器的版本大于或等于20
// iOS 7: IOS7版本
// Firefox ESR: 最新ESR版本的火狐
// > 5%: 全球统计有超过5%的使用率 
gulp.task('autoFx', function() {
  gulp.src(basedir + 'src/css/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'Android >= 4.0'],
      cascade: true, //是否美化属性值 默认：true 像这样：
      //-webkit-transform: rotate(45deg);
      //  transform: rotate(45deg);
      remove: true //是否去掉不必要的前缀 默认：true 
    }))
    .pipe(gulp.dest(basedir + 'src/css'))
});


//以下为选用任务：[minify,fonts,images,timestamp,sprites,statics,views,webpack]

//minify任务：js代码检测、压缩js/css/html
// var jshint = require('gulp-jshint'); //js检测
// gulp.task('hint:js', function() {
//   gulp.src(basedir+'src/js/*.js')
//   .pipe(jshint())
//   .pipe(jshint.reporter('default'));
// });
gulp.task('minify:js', function() {
  gulp.src(basedir + 'src/js/*.js')
    //.pipe(concat('all.js'))
    .pipe(gulp.dest(basedir + 'dist/js'))
    //.pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(basedir + 'dist/js'));
});
gulp.task('minify:css', function() {
  gulp.src(basedir + 'src/css/ticket/ticket.css') // 要压缩的css文件
    .pipe(minifyCss()) //压缩css
    .pipe(rename('ticket.min.css'))
    .pipe(gulp.dest(basedir + 'src/css/ticket'));
});
gulp.task('minify:html', function() {
  gulp.src(basedir + 'src/html/*.html') // 要压缩的html文件
    .pipe(minifyHtml()) //压缩
    .pipe(gulp.dest(basedir + 'dist/html'));
});
gulp.task('build', ['minify-js', 'minify-css'], function() {
  console.log('*.js,*.css,*.html已全部压缩完毕！');
});