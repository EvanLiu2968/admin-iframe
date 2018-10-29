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
//定义$弹框扩展(手机端的精简版/src/libs/layer/mobile/layer.js)，依赖于layer的弹框组件定制 http://layer.layui.com/mobile/
(function($) {
  $.extend({
    //信息框，必须参数:content:内容；可选参数:title:标题；yesfunc:确定回调；option:自定义配置
    alert: function(content, title, endfunc) {
      var index = layer.open({
        title: title == "no_title" ? "" : [ //或直接title:'标题'
          title ? title : "提示",
          "background-color:#20A0FF; color:white;margin:0" //标题样式
        ],
        btn: ["确定"],
        content: content,
        end: endfunc //层彻底销毁后的回调函数
      });
      return index;
    },
    //询问框,必须参数:content:内容；yesfunc:确定回调；可选参数:cancelfunc:取消回调；option:自定义配置
    confirm: function(content, yesfunc, nofunc, endfunc) {
      var index = layer.open({
        shadeClose: false,
        title: [ //或直接title:'标题'
          "确认",
          "background-color:#20A0FF; color:white;margin:0" //标题样式
        ],
        content: content,
        btn: ["确定", "取消"],
        yes: yesfunc,
        no: nofunc,
        end: endfunc //层彻底销毁后的回调函数
      });
      return index;
    },
    //询问框,必须参数:content:内容；yesfunc:确定回调；可选参数:cancelfunc:取消回调；option:自定义配置
    confirmFooter: function(content, yesfunc, nofunc, endfunc) {
      var index = layer.open({
        content: content,
        btn: ['删除', '取消'],
        skin: 'footer',
        yes: yesfunc,
        no: nofunc,
        end: endfunc //层彻底销毁后的回调函数
      });
      return index;
    },
    //提示框,必须参数:content:内容；可选参数:state:(0|1|2|3|4|5|6)，依次是(!|√|×|？|密码锁(权限不够)|哭脸(失败)|笑脸(成功))
    msg: function(content, time) {
      var index = layer.open({
        skin: 'msg',
        content: content,
        time: time ? time : 2
      });
      return index;
    },
    //tips框,必须参数:content:内容，selector:选择器；可选参数:color:背景颜色，direction:(1|2|3|4),依次(上|右|下|左),方向会智能选择，一般不用设置
    tips: function(content, time) {
      var index = layer.open({
        type: 3,
        style: "color:#484848",
        shade: true,
        content: content,
        time: time ? time : 0 //（默认是0不关闭）
      });
      return index;
    },
    //显示loading
    showLoading: function(txt) {
      //var pageScroll = common.getPageScroll();
      //setTimeout('scroll('+pageScroll.x+','+pageScroll.y+')', 1);
      var index = layer.open({
        shadeClose: false,
        type: 2,
        content: txt ? txt : ""
      });
      return index;
    },
    //关闭弹出框统一使用 layer.close(index);
    //URL格式化
    url: function(url, params) {
      return url + '?' + $.param(params);
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
    //是否是移动端
    isMobile: function() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(navigator.userAgent);
    },
    //是否是微信,(还可判断是否存在WeixinJSBridge,需在WeixinJSBridgeReady事件后)
    isWechat: function() {
      return /micromessenger/i.test(navigator.userAgent) || typeof navigator.wxuserAgent !== 'undefined';
    },
    //是否是手Q
    isMobileQQ: function() {
      return /MQQBrowser/i.test(navigator.userAgent);
    },
    //IP地址
    isIP: function(value) {
      return /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/.test(value);
    },
    //身份证
    isIdCardNo: function(value) {
      var birthday = new Date(value.substr(6, 4) + "-" + value.substr(10, 2) + "-" + value.substr(12, 2)); //不考虑15位身份证，目前有效身份证均为18位
      return /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/.test(value) && (birthday < new Date());
    },
    //车牌号
    isPlateNo: function(value) {
      return /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/.test(value);
    },
    //手机号
    isMobile: function() {
      var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
      return mobile.test(value);
    },
    //电话号码
    isTel: function() {
      var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
      return tel.test(value);
    },
    //QQ号码
    isQQ: function(value) {
      return /^[1-9]\d{4,10}$/.test(value);
    },
    //字母开头，长度在6-12之间，只能包含字符、数字和下划线的密码,按需修改。
    isPassword: function(value) {
      return /^[a-zA-Z]\w{5,12}$/.test(value);
    },
    //一个或多个中文
    isChinese: function(value) {
      return /^[\u4e00-\u9fa5]+$/.test(value);
    },
    //网址
    isUrl: function(value) {
      return /^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i.test(value)
    },
    isEmail: function(value) {
      return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
    },
    //计算字节长度,双字节字符[^\x00-\xff]
    getStrLength: function(value) {
      return value.replace(/[^\x00-\xff]/g, "aa").length; //将双字节字符替换为单字节字符
    },
    createUniqueStr: function() {
      var timestamp = +new Date() + '';
      var randomNum = parseInt((1 + Math.random()) * 65536) + '';
      return (+(randomNum + timestamp)).toString(32);
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
    //通过参数名获取url中的参数值,decodeURI转中文,decodeURIComponent转特殊字符
    getUrlParam: function(name, href, noDecode) {
      var reg = new RegExp('(?:\\?|#|&)' + name + '=([^&]*)(?:$|&|#)', 'i'),
        href = href || window.location.href,
        match = reg.exec(href),
        param = match ? match[1] : '';
      return !noDecode ? decodeURIComponent(decodeURI(param)) : param;
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
        'quot': '"'
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
    }
  }
})();

//根据需求添加删减
//文件上传
$(function() {
  function Fileinput($el) {
    this.$el = $el;
    this.$trigger = $el.find('[data-trigger="fileinput"]');
    this.$remove = $el.find('[data-remove="fileinput"]');
    this.$input = $el.find('[data-input="fileinput"]');
    this.$filename = $el.find('[data-filename="fileinput"]');
    var _this = this;
    this.$trigger.on("click", function() {
      _this.$input.trigger("click");
    });
    this.$remove.on("click", function() {
      _this.$input.val("");
      _this.$filename.empty().hide();
    });
    _this.$input.on("change", function(e) {
      var file = e.target.files[0];
      if (file) {
        _this.$filename.text(file.name).show();
      } else {
        _this.$filename.empty().hide();
      }
    })
  }
  $('[data-component="fileinput"]').each(function() {
    var $this = $(this);
    if ($this.data('fileinput')) return;
    $this.data('fileinput', (new Fileinput($this)));
  })
});