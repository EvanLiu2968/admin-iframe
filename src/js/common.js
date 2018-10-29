/*
 * Created by evanliu2968 on 2016/11/8.
 */
//扩展Date原型,增加格式化 fmt="yyyy-MM-dd HH:mm:ss 星期E"
Date.prototype.format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //12小时制
    "H+": this.getHours(), //24小时制
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  var week = {
    "0": "\u65e5",
    "1": "\u4e00",
    "2": "\u4e8c",
    "3": "\u4e09",
    "4": "\u56db",
    "5": "\u4e94",
    "6": "\u516d"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
};
//定义$弹框扩展，依赖于layer的弹框组件定制 http://layer.layui.com/api.html,手机端可用手机端的精简版
(function($) {
  $.extend({
    //信息框，必须参数:content:内容；可选参数:title:标题；yesfunc:确定回调；option:自定义配置
    alert: function(content, title, yesfunc, option) {
      option = $.extend(true, {
        offset: 'auto', //可设置'auto'居中
        title: title == "" ? false : [
          title ? title : "提示",
          "background-color:#20A0FF; color:white;" //标题样式
        ],
        btn: ["确定"]
      }, option);
      var index = layer.alert(content, option, yesfunc);
      return index;
    },
    //询问框,必须参数:content:内容；yesfunc:确定回调；可选参数:cancelfunc:取消回调；option:自定义配置
    confirm: function(content, yesfunc, cancelfunc, option) {
      option = $.extend(true, {
        offset: 'auto', //可设置'auto'居中
        shadeClose: false,
        title: [
          "确认",
          "background-color:#20A0FF; color:white;" //标题样式
        ],
        content: content,
        btn: ["确定", "取消"]
      }, option);
      var index = layer.confirm(content, option, yesfunc, cancelfunc);
      return index;
    },
    //提示框,必须参数:content:内容；可选参数:state:(0|1|2|3|4|5|6)，依次是(!|√|×|？|密码锁(权限不够)|哭脸(失败)|笑脸(成功))
    msg: function(content, state, time, endfunc) {
      var index = layer.msg(content, {
        offset: 'auto', //可设置'auto'居中
        icon: state ? state : 0, //设置默认"!"
        time: time ? time : 2000 //2秒后关闭（layer默认是3秒）
      }, endfunc);
      return index;
    },
    //tips框,必须参数:content:内容，selector:选择器；可选参数:color:背景颜色，direction:(1|2|3|4),依次(上|右|下|左),方向会智能选择，一般不用设置
    tips: function(content, selector, color, time, direction) {
      var index = layer.tips(content, selector, {
        tips: [direction ? direction : 2, color ? color : "#20A0FF"],
        time: time ? time : 2000 //2秒后关闭（layer默认是3秒）
      });
      return index;
    },
    //显示PC端loading
    showLoading: function() {
      var index = layer.load(2, { //0-2三种类型
        shade: [0.3, '#fff'] //带透明度的背景
      });
      return index;
    },
    //关闭layer弹窗统一用layer.close(obj);
    //URL格式化
    serializeURL: function(url, option) {
      return url + '?' + $.param(option);
    },
    //阻止右键及复制保存,
    preventCopy: function(selector) {
      selector = selector ? selector : 'body';
      $(selector).on('contextmenu selectstart dragstart', function(e) {
        e.preventDefault();
        e.returnValue = false;
      })
    },
    //用法与jQuery的ajax一样，添加一层loading处理
    loadAjax: function(option) {
      var loading = $.showLoading();
      var _complete = option && option.complete || function(a, b) {};
      var _option = $.extend(option, {
        complete: function(xhr, textStatus) {
          layer.close(loading);
          _complete(xhr, textStatus);
        }
      });
      var promise = $.ajax(_option);
      return promise;
    }
  });
})(window.jQuery || window.Zepto);

//定义common全局通用方法
var common = (function() {
  function isString(string) {
    return typeof string === 'string'
  }

  function isArray(obj) {
    return Array.isArray(obj)
  }

  function isFunction(obj) {
    return typeof obj === 'function'
  }

  function isPlainObject(obj) {
    var key;
    var hasOwn = ({}).hasOwnProperty;
    if (typeof obj !== "object" || obj.nodeType || (obj != null && obj === obj.window)) {
      return false;
    }
    if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype || {}, "isPrototypeOf")) {
      return false;
    }
    for (key in obj) {}

    return key === undefined || hasOwn.call(obj, key);
  }

  function extend() {
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[i] || {};
      i++;
    }
    if (typeof target !== "object" && !isFunction(target)) {
      target = {};
    }
    if (i === length) {
      target = this;
      i--;
    }
    for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          if (deep && copy && (isPlainObject(copy) ||
              (copyIsArray = isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && isArray(src) ? src : [];
            } else {
              clone = src && isPlainObject(src) ? src : {};
            }
            target[name] = extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  }
  return {
    extend: extend, //extend(deep, clone, copy)(即$.extend,使之不依赖jQuery)第一个参数设为true(默认false)，开启深拷贝
    isFunction: isFunction,
    isPlainObject: isPlainObject, //判断参数是否通过"{}"或"new Object"创建
    isArray: isArray,
    isString: isString,
    isEmptyObject: function(obj) {
      for (var n in obj) {
        return false;
      }
      return true;
    },
    //'use strict'模式下匿名函数this指向undefined，否则指向window
    isStrict: function() {
      return (function() {
        console.log("严格模式:" + !this);
        return !this;
      })()
    },
    //显示主页子标签页参数:标题|url| 类型(iframe或其他)| 是否可关闭| id | 图标
    openTab: function(url, title, tabcontainer, closable, tabid, icon) { //url必传
      title = title ? title : '无标题';
      tabcontainer = tabcontainer ? tabcontainer : 'iframe';
      closable = (closable === false) ? closable : true; //默认true可关闭
      if (window.dynamicTabTopMain) {
        window.dynamicTabTopMain.showTab(title, url, tabcontainer, closable, tabid, icon);
      } else if (window.top.dynamicTabTopMain) {
        window.top.dynamicTabTopMain.showTab(title, url, tabcontainer, closable, tabid, icon);
      } else {
        console.error("dynamicTabTopMain is undefined");
      }
    },
    //url要与openTab或a标签的url一致
    closeTab: function(url) {
      if (window.dynamicTabTopMain) {
        window.dynamicTabTopMain.closeTab(url);
      } else if (window.top.dynamicTabTopMain) {
        window.top.dynamicTabTopMain.closeTab(url);
      } else {
        console.error("dynamicTabTopMain is undefined");
      }
    },
    createUniqueStr: function() {
      var timestamp = +new Date() + '';
      var randomNum = ~~((1 + Math.random()) * (1 << 16)) + '';
      return (+(randomNum + timestamp)).toString(32);
    },
    createRandomColor: function() {
      //R,G,B可取值在0~255,当前设定在128~255
      var R = Math.random() * 127 + 128,
        G = Math.random() * 127 + 128,
        B = Math.random() * 127 + 128;
      return '#' + (R << 16 | G << 8 | B).toString(16);
    },
    //直接控制台输入common.debugCSS()
    debugCSS: function() {
      //$$("*")[控制台私有方法]等价于document.querySelectorAll("*")或jQuery("*")
      [].forEach.call(document.querySelectorAll("*"), function(a) {
        a.style.outline = "1px solid #" + (~~(Math.random() * (1 << 24))).toString(16)
      }); //或者这样：Math.random().toString(16).substr(-7, 6);
    },
    openWindow: function(url, title, w, h) {
      var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
      var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

      var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
      var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

      var left = ((width / 2) - (w / 2)) + dualScreenLeft;
      var top = ((height / 2) - (h / 2)) + dualScreenTop;
      var newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

      if (window.focus) {
        newWindow.focus();
      }
    },
    //根据接口规范统一做处理
    ajax: function(url, type, data, callback) {
      var promise = $.ajax({
        url: url,
        data: data,
        type: type,
        contentType: 'application/json;charset=utf-8',
        success: function(res, status, xhr) {
          if (res && res.status === 200) {
            callback(res.data, status, xhr);
          } else if (res) {
            $.alert(res.statustext || '请求错误', '异常');
          } else {
            $.alert('请求错误', '异常');
          }
        },
        error: function(xhr, status, error) {
          $.alert('无法发出请求！', '异常');
        }
      });
      return promise;
    },
    //bootstrapTable api说明：http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation
    getBootstrapTableOption: function() { //获取初始bootstrapTable配置，option=common.extend(common.getBootstrapTableOption(),option);
      return {
        method: 'get', //服务器数据的请求方式 'get' or 'post'
        //url: '/qStock/AjaxPage',
        //columns: [], //列
        //data:[],
        // ajax:function(param){},
        //ajaxOptions:{},//提交ajax请求时的附加参数
        queryParams: function(params) { //传参函数
          var data = {
            pagesize: params.limit,
            pageno: (params.offset / params.limit) + 1
          };
          $("#form-search").find('[data-action="search"]').each(function() {
            var $self = $(this);
            var key = $self.attr("name");
            data[key] = $self.val();
          });
          console.log(data);
          return data;
        },
        responseHandler: function(res) { //格式化请求返回响应的数据
          return {
            total: res.data.records_total,
            rows: res.data.records
          }
        },
        dataType: "json", //服务器返回数据类型 需包含{"total": 总页数,"rows":数据数组}
        contentType: "application/json", //发送到服务器的数据编码类型
        cache: false, //设置为 true 启用 AJAX 数据缓存
        sidePagination: "client", //设置在哪里进行分页，可选值为 'client' 或者 'server'
        queryParamsType: "limit", //参数格式,发送标准的RESTFul类型的参数请求
        toolbar: "#toolbar", //设置工具栏的选择器
        classes: "table table-hover table-bordered table-ele",
        undefinedText: "-", //当数据为 undefined 时显示的字符
        striped: false, //设置为 true 会有隔行变色效果
        sortable: true, //设置为false 将禁止所有列的排序
        silentSort: true, //设置为 false 将在点击分页按钮时，自动记住排序项。仅在 sidePagination设置为 server时生效.
        sortStable: true, //默认false,设置为 true 将获得稳定的排序
        sortOrder: "asc", //定义排序方式 'asc' 或者 'desc'
        //sortName:"",//定义排序列,通过url方式获取数据填写字段名，否则填写下标
        //iconsPrefix:'glyphicon',//定义字体库 ('lyphicon' or 'fa'
        //icons:"",//自定义图标
        //sortClass:"fff",//td元素被选择时的类名
        //height:"500px",//表格高度,默认自适应不定义
        pagination: true, //在表格底部显示分页工具栏
        paginationLoop: false, //设置为 true 启用分页条无限循环的功能,即最后一页的下一页到第一页
        onlyInfoPagination: false,
        pageSize: 10, //初始数据条数
        pageNumber: 1, //初始页码
        pageList: [10, 20, 50], //选择数据条数
        //rowStyle:function(row,index) {return "row";},//自定义行样式 参数为：row: 行数据index: 行下标,返回值可以为class或者css
        //rowAttributes:function(row,index) {return "data-id:123";},//自定义行样式 参数为：row: 行数据index: 行下标,返回值可以为class或者css 支持所有自定义属性
        //detailFormatter:function(index, row) {return '';},//格式化详细页面模式的视图。
        smartDisplay: true, //响应式布局分页组件
        search: false, //是否启用搜索框,这里为本地数据搜索，意义不大,请在传参函数中实现搜索
        searchOnEnterKey: false, //设置为 true时，按回车触发搜索方法，否则自动触发搜索方法
        strictSearch: false, //设置为 true启用 全匹配搜索，否则为模糊搜索
        searchText: "", //初始化搜索文字
        searchTimeOut: 500, //设置搜索超时时间
        trimOnSearch: false, //设置为true 将允许空字符搜索
        showHeader: true, //显示列头
        showFooter: false, //显示列脚
        showColumns: false, //是否显示内容列下拉框
        showToggle: false, //是否显示 切换试图（table/card）按钮
        showRefresh: false, //显示刷新按钮
        silent: true, //刷新事件必须设置
        showPaginationSwitch: false, //是否显示 数据条数选择框
        minimumCountColumns: 3, //当列数小于此值时，将隐藏内容列下拉框
        idField: "id", //data中存储复选框value的键值
        uniqueId: "id", //给每行一个唯一标识
        cardView: false, //设置为 true将显示card视图，适用于移动设备
        detailView: false, //设置为 true 可以显示详细页面模式
        escape: false, //转义HTML字符串，替换 &, <, >, ", `, 和 ' 字符
        searchAlign: "right", //指定 搜索框 水平方向的位置。'left' or 'right'
        buttonsAlign: "right", //指定 按钮 水平方向的位置。'left' or 'right'
        toolbarAlign: "left", //指定 toolbar 水平方向的位置。'left' or 'right'
        paginationVAlign: "bottom", //指定 分页条 在垂直方向的位置。'top' or 'bottom' or 'bonth'
        paginationHAlign: "right", //指定 分页条 在水平方向的位置。'top' or 'bottom' or 'bonth'
        paginationDetailHAlign: "left", //指定 分页详细信息 在水平方向的位置。'left' or 'right'
        paginationPreText: "上一页", //分页上一页文字或图标
        paginationNextText: "下一页", //分页下一页文字或图标
        showExport: false, //显示导出按钮
        exportDataType: "all", //导出类型,support: 'basic', 'all', 'selected'.
        exportTypes: ['excel', 'doc', 'txt', 'json', 'xml', 'csv', 'sql'],
        selectItemName: 'btSelectItem', //radio or checkbox 的字段名
        clickToSelect: true, //设置true 将在点击行时，自动选择rediobox 和 checkbox
        singleSelect: false, //设置单选
        checkboxHeader: true, //设置false 将在列头隐藏check-all checkbox
        maintainSelected: false, //设置为 true 在点击分页按钮或搜索按钮时，将记住checkbox的选择项
        formatLoadingMessage: function() { //表格汉化
          return '正在努力地加载数据中，请稍候……';
        },
        formatRecordsPerPage: function(pageNumber) {
          return '每页显示 ' + pageNumber + ' 条记录';
        },
        formatShowingRows: function(pageFrom, pageTo, totalRows) {
          return '显示第 ' + pageFrom + ' 到第 ' + pageTo + ' 条记录，总共 ' + totalRows + ' 条记录';
        },
        formatSearch: function() {
          return '搜索';
        },
        formatNoMatches: function() {
          return '没有找到匹配的记录';
        },
        formatPaginationSwitch: function() {
          return '隐藏/显示分页';
        },
        formatRefresh: function() {
          return '刷新';
        },
        formatToggle: function() {
          return '切换';
        },
        formatColumns: function() {
          return '列';
        },
        formatExport: function() {
          return '导出数据';
        },
        formatClearFilters: function() {
          return '清空过滤';
        }
      }
    },
    //dataTable api说明：http://datatables.club/reference/#options
    getDataTableOption: function() {
      return {
        //ajax: {//类似jquery的ajax参数，基本都可以用。
        //  type: "get",//后台指定了方式，默认get，外加datatable默认构造的参数很长，有可能超过get的最大长度。
        //  url: "url",
        //  dataSrc: "data",//定义为从数据源获取什么样的数据对象加载给Datatables
        //  data: function (param) {//d 是原始的发送给服务器的数据，默认很长。
        //    var data = {};//因为服务端排序，可以新建一个参数对象
        //    data.start = param.start;//开始的序号
        //    data.length = param.length;//要取的数据的
        //    data.search=$("#serach").val();
        //    return data;//自定义需要传递的参数。
        //  }
        //},
        //data:[],//不用ajax时的数据
        //columns: [//对应上面thead里面的序列
        //  { data: "id",title:"" ,width:"",className:""},//字段名字和返回的json序列的key对应
        //  { data: "name",title:"名字", render:function(data, type, row, meta){return data}},
        //  { data: function( row, type, setting, meta){return ""}}
        //],
        dom: "<'row'r>t<'row'<'col-md-2'l><'col-md-3'i><'col-md-7'p>>", //位置调整,t:table,l:lengthMenu,;:info,p:paginate
        jQueryUI: false, //控制是否使用jquerui的样式
        renderer: "bootstrap", //使用bootstrap主题
        info: true, //控制是否显示表格左下角的信息
        lengthChange: true, //是否允许用户改变表格每页显示的记录数
        ordering: false, //是否允许Datatables开启排序
        paging: true, //是否开启本地分页
        processing: true, //是否显示处理状态,关联language.processing文字
        //scrollX:"100%",//设置水平滚动
        //scrollY:"100%",//设置垂直滚动
        searching: false, //是否允许Datatables开启本地搜索
        serverSide: true, //是否开启服务器模式
        stateSave: true, //保存状态 - 在页面重新加载的时候恢复状态
        autoWidth: true, //控制Datatables是否自适应宽度
        deferRender: true, //控制Datatables是否延迟渲染
        "pagingType": "full_numbers", //显示第一页、最后一页、上一页、下一页和页码按钮,"numbers"|"simple"|"simple_numbers"|"full"|"full_numbers"|"first_last_numbers"
        "pageLength": 10, //每页显示的记录数
        "lengthMenu": [10, 25, 50],
        //order:[1, 'asc'],//表格在初始化的时候的排序,"asc"|"desc"
        //orderMulti: false,//多列排序
        language: {
          processing: "载入中", //处理页面数据的时候的显示
          lengthMenu: "显示 _MENU_ 项结果",
          paginate: { //分页的样式文本内容。
            previous: "上一页",
            next: "下一页",
            first: "第一页",
            last: "最后一页"
          },
          zeroRecords: "没有内容", //table tbody内容为空时，tbody的内容。
          //下面三者构成了总体的左下角的内容。
          info: "显示第 _START_ 至 _END_ 项结果，共 _PAGES_ 页", //"总共_PAGES_ 页，显示第_START_ 到第 _END_ ，筛选之后得到 _TOTAL_ 条，初始_MAX_ 条 "
          infoEmpty: "0条记录", //筛选为空时左下角的显示。
          infoFiltered: "" //筛选之后的左下角筛选提示(另一个是分页信息显示，在上面的info中已经设置，所以可以不显示)，
        }
      }
    },
    //下载图片,下载完成后进行回调
    loadImage: function(url, callback, data) {
      var img = new Image(); //创建一个Image对象，实现图片的预下载
      img.src = url;
      img.data = data;
      if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
        callback.call(img);
        return; // 直接返回，不用再处理onload事件
      }
      img.onload = function() { //图片下载完毕时异步调用callback函数。
        callback.call(img); //将回调函数的this替换为Image对象
      };
    },
    //异步加载css和js
    loadJs: function(path, callback) {
      "use strict";
      var isCss, ref, e;
      if (/\.css$/.test(path)) {
        // css
        ref = document.getElementsByTagName("link")[0];
        e = document.createElement('link');
        e.rel = 'stylesheet';
        e.href = path;
      } else {
        // javascript
        ref = document.getElementsByTagName("script")[0];
        e = document.createElement('script');
        e.src = path;
        e.async = true;
      }
      ref.parentNode.appendChild(e);
      //ref.parentNode.insertBefore( e, ref );//在ref之前插入
      if (callback && typeof(callback) === "function") {
        e.onload = callback.call(e);
      }
    },
    //图片上传前 js压缩，files：图片input上传对象数组，回调函数返回base64编码数组，scale_base:宽、高最小尺寸,k:压缩系数
    // 去掉base64标记后 src = src.replace(/^data:image\/(png|jpg|jpeg);base64,/, "") 可以用ajax提交到后台，提交后可以直接存byte[] Image
    imgCompress: function(files, callback, kb, scale_base, k) {
      kb = kb ? kb : 300; //当图片大小大于kb时才进行压缩(单位kb)
      scale_base = scale_base ? scale_base : 1000; //宽、高最小尺寸,默认1000,等比缩放
      k = k ? k : 0.9; //压缩系数,默认0.9
      var srcs = []; //返回的base64编码数组
      var canvas = document.getElementById('imgCompressCanvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'imgCompressCanvas';
      }
      var ctx = canvas.getContext('2d'); //获取2d编辑容器
      var img_cache = document.createElement("img");
      //var img_cache = new Image();//创建一个图片

      var tmpFile, i = 0;
      var compress = function() {
        if (i >= files.length) {
          callback(srcs);
          return;
        }
        var reader = new FileReader();
        tmpFile = files[i];
        reader.readAsDataURL(tmpFile);
        reader.onload = function(e) {
          img_cache.src = e.target.result;
          img_cache.onload = function() {
            var m;
            if (tmpFile.size > kb * 1024) {
              if (img_cache.width > img_cache.height) {
                m = img_cache.width / img_cache.height;
                canvas.height = scale_base;
                canvas.width = scale_base * m;
              } else {
                m = img_cache.height / img_cache.width;
                canvas.height = scale_base * m;
                canvas.width = scale_base;
              }
            } else {
              canvas.height = img_cache.height;
              canvas.width = img_cache.width;
            }

            ctx.drawImage(img_cache, 0, 0, canvas.width, canvas.height);

            srcs.push(canvas.toDataURL("image/jpeg", k));
            i++;
            compress();
          }
        }
      };
      compress();
    },
    //将毫秒数times转换为-天-时-分-秒
    getTime: function(times) {
      var day = times / (1000 * 3600 * 24);
      var cache1 = times % (1000 * 3600 * 24);
      var hour = times / (1000 * 3600);
      var cache2 = cache1 % (1000 * 3600);
      var minute = cache2 / (1000 * 60);
      var cache3 = cache2 % (1000 * 60);
      var second = cache3 / 1000;
      return {
        day: Math.ceil(day),
        hour: parseInt(hour) < 10 ? '0' + parseInt(hour) : '' + parseInt(hour),
        minute: parseInt(minute) < 10 ? '0' + parseInt(minute) : '' + parseInt(minute),
        second: parseInt(second) < 10 ? '0' + parseInt(second) : '' + parseInt(second)
      }
    },
    //获取当前滚动位置,用于跳转到其他页面后在返回时恢复跳转前的状态
    getPageScroll: function() {
      var x = 0,
        y = 0;
      if (window.pageYOffset) { // all except IE
        y = window.pageYOffset;
        x = window.pageXOffset;
      } else if (document.documentElement && document.documentElement.scrollTop) { // IE 6 Strict
        y = document.documentElement.scrollTop;
        x = document.documentElement.scrollLeft;
      } else if (document.body) { // all other IE
        y = document.body.scrollTop;
        x = document.body.scrollLeft;
      }
      return {
        x: x,
        y: y
      };
    },
    serializeParam: function(param) {
      if (!param) return '';
      var qstr = [];
      for (var k in param) {
        qstr.push(encodeURIComponent(k) + '=' + encodeURIComponent(param[k]));
      }
      return qstr.join('&');
    },
    //通过参数名获取url中的参数值(仅第一个参数必传),decodeURI转中文,decodeURIComponent转特殊字符
    getUrlParam: function(name, href, noDecode) {
      var reg = new RegExp('(?:\\?|#|&)' + name + '=([^&]*)(?:$|&|#)', 'i'),
        href = href || window.location.href,
        match = reg.exec(href),
        param = match ? match[1] : '';
      return !noDecode ? decodeURIComponent(decodeURI(param)) : param;
    },
    setCookie: function(name, value, domain, path, hour) {
      var domainPrefix = window.location.host;
      if (hour) {
        var today = new Date();
        var expire = new Date();
        expire.setTime(today.getTime() + 3600000 * hour);
      }
      window.document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
      return true;
    },
    //获取参数名获取cookie中的参数值
    getCookie: function(name) {
      var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
      var m = window.document.cookie.match(r);
      return (!m ? "" : decodeURIComponent(decodeURI(m[1])));
    },
    removeCookie: function(name, domain, path) {
      var domainPrefix = window.location.host;
      window.document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
    },
    addJsonObject: function(json, key, value, maxNum) {
      if (!maxNum) maxNum = 999999999;
      json = common.delJsonObject(json, key);
      while (Object.getOwnPropertyNames(json).length >= maxNum) {
        for (var i in json) {
          delete json[i];
          break;
        }
      }
      json[key] = value;
      return json;
    },
    delJsonObject: function(json, key) {
      if (json[key]) {
        delete json[key];
      }
      return json;
    },
    addJsonArray: function(json, obj, maxNum) {
      if (!maxNum) maxNum = 999999999;
      json = common.delJsonArray(json, obj);
      while (json.length >= maxNum) {
        json.shift();
      }
      json.push(obj);
      return json;
    },
    delJsonArray: function(json, obj) {
      for (var i in json) {
        if (JSON.stringify(json[i]) == JSON.stringify(obj)) {
          json.splice(i, 1);
          break;
        }
      }
      return json;
    },
    addLocalStorage: function(key, obj, maxNum) {
      var json = common.getLocalStorage(key);
      json = common.addJsonArray(json, obj, maxNum);
      common.setLocalStorage(key, json);
    },
    addLocalStorageObj: function(key, name, value, maxNum) {
      var json = common.getLocalStorageObj(key);
      json = common.addJsonObject(json, name, value, maxNum);
      common.setLocalStorage(key, json);
    },
    setLocalStorage: function(key, json) {
      if (typeof json != "string") {
        json = JSON.stringify(json);
      }
      localStorage.setItem(key, json);
    },
    getLocalStorage: function(key) {
      var json;
      var value = localStorage.getItem(key);
      if (value) {
        try {
          json = JSON.parse(value);
          if (!(json instanceof Array)) {
            json = new Array();
          }
        } catch (e) {
          json = new Array();
        }
      } else {
        json = new Array();
      }
      return json;
    },
    getLocalStorageObj: function(key) {
      var json;
      var value = localStorage.getItem(key);
      if (value) {
        try {
          json = JSON.parse(value);
          if (json instanceof Array) {
            json = json[0] ? json[0] : new Object();
          }
        } catch (e) {
          json = new Object();
        }
      } else {
        json = new Object();
      }
      return json;
    },
    delLocalStorage: function(key, obj) {
      if (obj) {
        var json = common.getLocalStorage(key);
        json = common.delJsonArray(json, obj);
        common.setLocalStorage(key, json);
      } else {
        localStorage.removeItem(key);
      }
    },
    addSessionStorage: function(key, name, value, maxNum) {
      var json = common.getSessionStorage(key);
      json = common.addJsonObject(json, name, value, maxNum);
      common.setSessionStorage(key, json);
    },
    setSessionStorage: function(key, json) {
      if (typeof json != "string") {
        json = JSON.stringify(json);
      }
      sessionStorage.setItem(key, json);
    },
    getSessionStorage: function(key) {
      var json;
      var value = sessionStorage.getItem(key);
      if (value) {
        try {
          json = JSON.parse(value);
          if (json instanceof Array) {
            json = json[0] ? json[0] : new Object();
          }
        } catch (e) {
          json = new Object();
        }
      } else {
        json = new Object();
      }
      return json;
    },
    delSessionStorage: function(key, name) {
      if (name) {
        var json = common.getSessionStorage(key);
        json = common.delJsonObject(json, name);
        common.setSessionStorage(key, json);
      } else {
        sessionStorage.removeItem(key);
      }
    },
    //转意符换成普通字符
    escape2Html: function(str) {
      var arrEntities = {
        'lt': '<',
        'gt': '>',
        'nbsp': ' ',
        'amp': '&',
        'quot': '"',
        '#39': "'"
      };
      return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
        return arrEntities[t];
      });
    },
    // &nbsp;转成空格
    nbsp2Space: function(str) {
      var arrEntities = {
        'nbsp': ' '
      };
      return str.replace(/&(nbsp);/ig, function(all, t) {
        return arrEntities[t];
      });
    },
    getIeVersion: function() {
      var retVal = -1,
        ua, re;
      if (navigator.appName === 'Microsoft Internet Explorer') {
        ua = navigator.userAgent;
        re = new RegExp('MSIE ([0-9]{1,})');
        if (re.exec(ua) !== null) {
          retVal = parseInt(RegExp.$1);
        }
      }
      return retVal;
    }
  }
})();

//根据需求添加删减

//原型界面开发阶段页面注释，data-notes标记
$(function() {
  setTimeout(function() {
    $("[data-notes]").each(function() {
      var self = $(this);
      var content = self.data("notes");
      if (content == "") {
        return
      }
      var id = common.createUniqueStr();
      content = '<div style="padding-right:10px;">' + content + '<span id="' + id + '" style="position:absolute;top:0;right:0;padding:0 6px;cursor:pointer;">×</span></div>';
      var color = self.data("color");
      var time = parseInt(self.data("time")) * 1000;
      var direction = parseInt(self.data("direction"));
      var notes = layer.tips(content, self, {
        tips: [direction ? direction : 3, color ? color : "#475669"],
        time: time ? time : 0,
        fixed: false,
        tipsMore: true
      });
      $("#" + id).on("click", function() {
        layer.close(notes);
      })
    })
  }, 0);
});

//有data-tips的表单元素点击时弹出提示框,默认颜色#3c8dbc,时间10s,对应值data-color="#7cbd73" data-time="5s" data-direction="3"
$(function() {
  var tipsBox;
  $("input[data-tips],select[data-tips],textarea[data-tips]").on("focus", function() {
    var self = $(this);
    var content = self.data("tips");
    if (content == "") {
      return
    }
    var color = self.data("color");
    var time = parseInt(self.data("time")) * 1000;
    var direction = parseInt(self.data("direction"));
    time = time ? time : 10000;
    tipsBox = $.tips(content, self, color, time, direction);
  }).on("blur", function() {
    layer.close(tipsBox);
  })
});

//搜索表单切换
$(function() {
  var target = $("#form-search-collapse");
  var control = $("a[href='#form-search-collapse']");
  target.on("shown.bs.collapse", function() {
    control.html('<i class="fa fa-angle-double-up"></i>隐藏搜索项');
  }).on("hidden.bs.collapse", function() {
    control.html('<i class="fa fa-angle-double-down"></i>显示搜索项');
  })
});

//页面滚动时，组件始终显示在页面上，标识为：data-action="sticky" data-offset="20"(居顶部的距离)
$(function() {
  $('[data-action="sticky"]').each(function() {
    var $target = $(this);
    var offset = $target.data("offset");
    offset = offset ? offset : 20;
    var offsetTop = $target.offset().top;
    var o_position = $target.css('position');
    var o_top = $target.css('top');
    var $wrapper = $(".wrapper");
    var o_zIndex = $target.css('zIndex');
    var judgeFixedHandle = function(e) {
      var offsetY = offsetTop - $(this).scrollTop();
      //console.log(offsetY);
      if (offsetY < offset) {
        $target.css({
          'position': 'fixed',
          'top': offset + 'px',
          'zIndex': '999'
        });
      } else {
        $target.css({
          'position': o_position,
          'top': o_top,
          'zIndex': o_zIndex
        });
      }
    };
    //滚动事件监听
    if ($wrapper.length === 0) {
      $(document).on("scroll", judgeFixedHandle);
    } else {
      $wrapper.on("scroll", judgeFixedHandle);
    }
  });
});

//动态计算某些需要填充满屏幕组件的高度，标识为：data-action="computeHeight" data-offset="100" 执行结果为：
$(function() {
  $('[data-action="computeHeight"]').each(function() {
    var target = $(this);
    var offset = target.data("offset");
    var computeHeight = function() {
      var winHeight = $(window).height();
      target.height(winHeight - offset);
    };
    computeHeight();

    var resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';
    var timer;
    window.addEventListener(resizeEvent, function() {
      clearTimeout(timer);
      timer = setTimeout(computeHeight, 300);
    }, false);
  });
});