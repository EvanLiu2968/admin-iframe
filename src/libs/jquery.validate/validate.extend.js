/*****************************************************************
@import "./jquery.metadata.js"
 *****************************************************************/
(function($) {
  //console.log('@import "./jquery.metadata.js"');

  $.extend({
  metadata : {
  defaults : {
    type: 'class',
    name: 'metadata',
    cre: /({.*})/,
    single: 'metadata'
  },
  setType: function( type, name ){
    this.defaults.type = type;
    this.defaults.name = name;
  },
  get: function( elem, opts ){
    var settings = $.extend({},this.defaults,opts);
    // check for empty string in single property
    if ( !settings.single.length ) settings.single = 'metadata';
    
    var data = $.data(elem, settings.single);
    // returned cached data if it already exists
    if ( data ) return data;
    
    data = "{}";
    
    var getData = function(data) {
    if(typeof data != "string") return data;
    
    if( data.indexOf('{') < 0 ) {
    data = eval("(" + data + ")");
    }
    };
    
    var getObject = function(data) {
    if(typeof data != "string") return data;
    
    data = eval("(" + data + ")");
    return data;
    };
    
    if ( settings.type == "html5" ) {
    var object = {};
    $( elem.attributes ).each(function() {
    var name = this.nodeName;
    if(name.match(/^data-/)) name = name.replace(/^data-/, '');
    else return true;
    object[name] = getObject(this.nodeValue);
    });
    } else {
    if ( settings.type == "class" ) {
    var m = settings.cre.exec( elem.className );
    if ( m )
    data = m[1];
    } else if ( settings.type == "elem" ) {
    if( !elem.getElementsByTagName ) return;
    var e = elem.getElementsByTagName(settings.name);
    if ( e.length )
    data = $.trim(e[0].innerHTML);
    } else if ( elem.getAttribute != undefined ) {
    var attr = elem.getAttribute( settings.name );
    if ( attr )
    data = attr;
    }
    object = getObject(data.indexOf("{") < 0 ? "{" + data + "}" : data);
    }
    
    $.data( elem, settings.single, object );
    return object;
  }
  }
  });

  $.fn.metadata = function( opts ){
  return $.metadata.get( this[0], opts );
  };

})(jQuery);

/*****************************************************************
@import "./messages_zh.js"
 *****************************************************************/
(function( factory ) {
  //console.log('@import "./messages_zh.js"');
  if ( typeof define === "function" && define.amd ) {
  define( ["jquery", "./jquery.validate"], factory );
  } else {
  factory( jQuery );
  }
}(function( $ ) {

  /*
   * Translated default messages for the jQuery validation plugin.
   * Locale: ZH (Chinese, 中文 (Zhōngwén), 汉语, 漢語)
   */
  $.extend($.validator.messages, {
  required: "该输入项为必填项",
  remote: "请修正此字段",
  email: "请输入有效的电子邮件地址",
  url: "请输入有效的网址",
  date: "请输入有效的日期",
  dateISO: "请输入有效的日期 (YYYY-MM-DD)",
  number: "请输入有效的数字",
  digits: "只能输入数字",
  creditcard: "请输入有效的信用卡号码",
  equalTo: "您的两次输入不相同",  	//equalTo:"#field"
  extension: "请输入有效的后缀",
  maxlength: $.validator.format("最多可以输入 {0} 个字符"),
  minlength: $.validator.format("最少要输入 {0} 个字符"),
  rangelength: $.validator.format("请输入长度在 {0} 到 {1} 之间的字符串"),//rangelength:[6,16]
  range: $.validator.format("请输入范围在 {0} 到 {1} 之间的数值"),
  max: $.validator.format("请输入不大于 {0} 的数值"),
  min: $.validator.format("请输入不小于 {0} 的数值")
  });
}));

/*****************************************************************
 jQuery Validate扩展验证方法
 *****************************************************************/
(function(){
  //console.log('@import jQuery Validate扩展验证方法');
  //this.optional(element)即验证规则的参数
  // 判断浮点数value是否大于或等于0
  jQuery.validator.addMethod("isFloatGteZero", function(value, element) {
  value=parseFloat(value);
  return this.optional(element) || value>=0;
  }, "请输入一个正的数值");
  // 匹配integer
  jQuery.validator.addMethod("isInteger", function(value, element) {
  return this.optional(element) || (/^[-\+]?\d+$/.test(value) && parseInt(value)>=0);
  }, "请输入一个正的整数");

  // 判断数值类型，包括整数和浮点数
  jQuery.validator.addMethod("isNumber", function(value, element) {
  return this.optional(element) || /^[-\+]?\d+$/.test(value) || /^[-\+]?\d+(\.\d+)?$/.test(value);
  }, "请输入数值");

  // 只能输入[0-9]数字
  jQuery.validator.addMethod("isDigits", function(value, element) {
  return this.optional(element) || /^\d+$/.test(value);
  }, "只能输入0-9数字");

  // 判断中文字符
  jQuery.validator.addMethod("isChineseChar", function(value, element) {
  return this.optional(element) || /^[\u0391-\uFFE5]+$/.test(value);
  }, "只能包含中文字符");

  // 判断英文字符
  jQuery.validator.addMethod("isEnglishChar", function(value, element) {
  return this.optional(element) || /^[A-Za-z]+$/.test(value);
  }, "只能包含英文字符");

  // 手机号码验证
  jQuery.validator.addMethod("isMobile", function(value, element) {
  var length = value.length;
  return this.optional(element) || (length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value));
  }, "请正确填写您的手机号码");

  // 电话号码验证
  jQuery.validator.addMethod("isTel", function(value, element) {
  var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
  return this.optional(element) || (tel.test(value));
  }, "请正确填写您的电话号码");

  // 联系电话(手机/电话皆可)验证
  jQuery.validator.addMethod("isPhone", function(value,element) {
  var length = value.length;
  var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
  return this.optional(element) || tel.test(value) || (length==11 && mobile.test(value));
  }, "请正确填写您的联系方式");

  // 匹配qq
  jQuery.validator.addMethod("isQQ", function(value, element) {
  return this.optional(element) || /^[1-9]\d{4,10}$/.test(value);
  }, "请正确填写您的QQ");

  // 邮政编码验证
  jQuery.validator.addMethod("isZipCode", function(value, element) {
  var zip = /^[0-9]{6}$/;
  return this.optional(element) || (zip.test(value));
  }, "请正确填写您的邮政编码。");

  // 匹配密码，以字母开头，长度在6-12之间，只能包含字符、数字和下划线。
  jQuery.validator.addMethod("isPwd", function(value, element) {
  return this.optional(element) || /^[a-zA-Z]\\w{6,12}$/.test(value);
  }, "以字母开头，长度在6-12之间，只能包含字符、数字和下划线。");

  // IP地址验证
  jQuery.validator.addMethod("ip", function(value, element) {
  return this.optional(element) || /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/.test(value);
  }, "请填写正确的IP地址。");

  // 字符验证，只能包含中文、英文、数字、下划线等字符。
  jQuery.validator.addMethod("stringCheck", function(value, element) {
  return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/.test(value);
  }, "只能包含中文、英文、数字、下划线等字符");

  // 字符验证，除了纯空格，支持中文、英文、数字、空格、括号、下划线、中划线、点号及其组合，包括中文（）—。，
  jQuery.validator.addMethod("charCheck", function(value, element) {
  return this.optional(element) ||/^[a-zA-Z0-9\u4e00-\u9fa5-_().（）—。，\s]*[a-zA-Z0-9\u4e00-\u9fa5-_().（）—。，][a-zA-Z0-9\u4e00-\u9fa5-_().（）—。，\s]*$/g.test(value);
  }, "名称支持中文、英文、数字、空格、括号、下划线、中划线、点号及其组合（单独输入空格不支持）");

  // 字符验证，除了纯空格，支持英文、数字、空格、下划线、中划线、点号及其组合
  jQuery.validator.addMethod("charEnCheck", function(value, element) {
  return this.optional(element) ||/^[a-zA-Z0-9-_.\s]*[a-zA-Z0-9-_.][a-zA-Z0-9-_.\s]*$/g.test(value);
  }, "名称支持英文、数字、空格、下划线、中划线、点号及其组合（单独输入空格不支持）");

  // 字符验证，不能只输入纯空格
  jQuery.validator.addMethod("isSpaceLimit", function(value, element) {
  return this.optional(element) ||/^[\s]*$/g.test(value)==false;
  }, "单独输入空格不支持");

  // 匹配english
  jQuery.validator.addMethod("isEnglish", function(value, element) {
  return this.optional(element) || /^[A-Za-z]+$/.test(value);
  }, "请输入英文");

  // 匹配汉字E
  jQuery.validator.addMethod("isChinese", function(value, element) {
  return this.optional(element) || /^[\u4e00-\u9fa5]+$/.test(value);
  }, "请输入汉字");

  // 匹配中文(包括汉字和字符)
  jQuery.validator.addMethod("isChineseChar", function(value, element) {
  return this.optional(element) || /^[\u0391-\uFFE5]+$/.test(value);
  }, "请输入中文(包括汉字和字符) ");

  // 判断是否为合法字符(a-zA-Z0-9-_)
  jQuery.validator.addMethod("isRightfulString", function(value, element) {
  return this.optional(element) || /^[A-Za-z0-9_-]+$/.test(value);
  }, "请输入英文、数字、下划线、中划线");

  // 判断是否包含中英文特殊字符，除英文"-_"字符外
  jQuery.validator.addMethod("isContainsSpecialChar", function(value, element) {
  var reg = RegExp(/[(\ )(\`)(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\+)(\=)(\|)(\{)(\})(\')(\:)(\;)(\')(',)(\[)(\])(\.)(\<)(\>)(\/)(\?)(\~)(\！)(\@)(\#)(\￥)(\%)(\…)(\&)(\*)(\（)(\）)(\—)(\+)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\’)(\。)(\，)(\、)(\？)]+/);
  return this.optional(element) || !reg.test(value);
  }, "含有中英文特殊字符");

  // url地址验证
  jQuery.validator.addMethod("isUrl", function(value, element) {
  return this.optional(element) || /^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i.test(value);
  }, "请输入有效的网址");

  // 判断角色编码是否重复
  jQuery.validator.addMethod("checkRepeat", function(value, element) {
  $(element).trigger("myCheck");
  return true == $(element).attr("isRepeat");
  }, "该角色已存在");

  // 判断两个input值为从小到大的范围，需要两个input为兄弟元素
  jQuery.validator.addMethod("checkRange", function(value, element) {
  return this.optional(element) || checkRange(value,element);
  }, "请输入正确的范围");

  // 判断邮箱地址
  jQuery.validator.addMethod("isEmail", function(value, element) {
  var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  return this.optional(element) || reg.test(value);
  }, "请输入正确的邮箱地址");

  // 身份证号码验证
  jQuery.validator.addMethod("isIdCardNo", function(value, element) {
  var birthday=new Date(value.substr(6,4)+"-"+value.substr(10,2)+"-"+value.substr(12,2)); //不考虑15位身份证，目前有效身份证均为18位
  return this.optional(element) || /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/.test(value)&&(birthday<new Date());
  }, "请输入正确的身份证号码。");

  // 身份证号码验证
  jQuery.validator.addMethod("isPlateNo", function(value, element) {
  return this.optional(element) || /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/.test(value);
  }, "请输入正确的身份证号码。");

  // 判断input值小于等于target的值，参数为target的选择器
  //   <input type="text" validate="{numberRange:'#target'}" />
  jQuery.validator.addMethod("numberRange", function(value, element,param) {
  return this.optional(element) || numberRange(value,element,param);
  }, "请输入正确的值范围");
  function numberRange(value,element,param){
  var $target=$(param);
  if(value>=$target.val()){
    return true;
  } else {
    return false;
  }
  }

  // 判断input的日期小于等于target的日期，参数为target的选择器
  jQuery.validator.addMethod("dateRange", function(value, element,param) {
  return this.optional(element) || dateRange(value,element,param);
  }, "请输入正确的日期范围");
  function dateRange(value,element,param){
  var $target=$(param);
  if(new Date(value)>=new Date($target.val())){
    return true;
  } else {
    return false;
  }
  }

  // validate="{checkboxLimit:n}" checkbox选中个数>=n
  jQuery.validator.addMethod("checkboxLimit", function(value, element,param) {
  return checkboxLimit(value,element,param);
  }, "请至少选择 {0} 个");
  function checkboxLimit(value,element,param){
  var $element=$(element);
  var $parent=$element.closest("label").length===1?$element.closest("label").parent():$element.parent();
  var count=0;
  $parent.find('[type="checkbox"]').on("change",function(){
    $element.valid();
  }).each(function(){
    if ($(this).prop('checked')) { count++; }
  });
  return count>=param
  }
   // 判断车牌号码格式
  jQuery.validator.addMethod("isCarNum", function(value, element) {
  var reg = /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/;
  return this.optional(element) || reg.test(value);
  }, "请输入正确的车牌号码");

})();

//通用方法 为表单元素初始化 参数selector为form表单的选择器字符串，()
function formValidateInit(selector) {
  $.metadata.setType('attr', 'validate');
  $(selector).validate({
  errorElement: "span",
  errorPlacement: function (error, element) {
    error.addClass("form-msg-error");
    //console.log(element.data("error"));
    if (element.data("error")!==""&&element.data("error")!==undefined){  //表单元素有data-error="#target"的将错误信息插入#target
    $(element.data("error")).append(error);
    } else if (element.prop("type") === "checkbox"||element.prop("type") === "radio") {
    var label=element.closest("label");
    label.length===1?label.parent().append(error):element.parent().append(error);
    }else {
    element.parent().append(error);
    }
  },
  highlight: function (element, errorClass, validClass) {
    $(element).parents(".form-group").addClass("has-error").removeClass("has-success");
  },
  unhighlight: function (element, errorClass, validClass) {
    $(element).parents(".form-group").addClass("has-success").removeClass("has-error");
  }
  });
}