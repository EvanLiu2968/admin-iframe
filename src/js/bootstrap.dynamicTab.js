(function ($) {
  //打开新标签页
  var showTabHandler = function (targettabs, icon, title, tabid, url, closable, tabcontainer) {
    var $headerwrapper = $('ul.nav.nav-tabs').filter('[data-tabsid="' + targettabs + '"]');
    var $contentwrapper = $('div.tab-content').filter('[data-tabsid="' + targettabs + '"]');
    var settings = $headerwrapper.data('bs.tab.gciPlugin.dynamicTab').settings;

    if ($headerwrapper.find('a[href="#' + tabid + '"]').length == 0) {
      if ($headerwrapper.find('a[data-toggle="tab"]').length >= settings.tabLimit) {
        //console.log(typeof jQuery.alert() === "function"&&layer);
        //console.log(typeof jQuery.alert() === "function");
        if(common&&layer){
          var alert=jQuery.alert('最多只能同时打开'+settings.tabLimit+'个页面，请您先关闭部分页面。', '系统消息',function(){layer.close(alert);},{offset:"160px"})
        }else{
          alert('最多只能同时打开'+settings.tabLimit+'个页面，请您先关闭部分页面。');
        }
        return;
      } else {
        appendTabHandler(targettabs, icon, title, tabid, url, closable, tabcontainer);
      }
    }

    $headerwrapper.find('a[href="#' + tabid + '"]').tab('show');
  };
  //当前页标签栏位置移动
  var ajustActiveTabLinksHandler = function (e) {
    //e.relatedTarget; // previous active tab

    //var $activeli = $(e.target).parent(); //activated li object
    var $activeli = $('ul.nav.nav-tabs[data-tabsid]> li.active'); //activated li object
    var $headerwrapper = $activeli.parent();
    var $headerparent = $headerwrapper.parent();

    var li_width=$activeli.width();//标签栏宽
    var offset_m=0;//负margin修正
    if($headerwrapper.hasClass("nav-dynamicTab-default")){
      offset_m=18;
    }else if($headerwrapper.hasClass("nav-dynamicTab-arc")){
      offset_m=30;
    }else if($headerwrapper.hasClass("nav-dynamicTab-square")){
      offset_m=-4;
    }

    var len=parseInt(($headerparent.width()-80)/(li_width-offset_m));//能容纳的标签栏个数的一半
    //console.log(li_width);console.log(len);console.log($activeli.prevAll().length);
    if($activeli.prevAll().length>(len/2)&&$activeli.nextAll()>(len/2)){
      //console.log("ajust center");
      $headerwrapper.animate({
        left:-parseInt($activeli.prevAll().length-len/2)*(li_width-offset_m)
      },200);
    }else if($activeli.prevAll().length>=len){
      //console.log("ajust right");
      $headerwrapper.animate({
        left:-parseInt($activeli.prevAll().length-len+1)*(li_width-offset_m)
      },200);
    }else{
      $headerwrapper.animate({
        left:0
      },200);
    }
  };
  //下拉列表切换
  var dropdownMenuClickHandler = function (e) {
    e.preventDefault();
    var targettabs = $('ul.nav.nav-tabs[data-tabsid]').attr('data-tabsid');
    var $headerwrapper = $('ul.nav.nav-tabs').filter('[data-tabsid="' + targettabs + '"]');
    var self=$(this);
    var tabid =self.find('a').attr('href');
    $headerwrapper.find('> li> a[href="' + tabid + '"]').tab('show');
    self.addClass("active").siblings("li").removeClass("active");
  };
  //刷新当前页
  var refreshActiveTabLinksHandler = function (e) {
    e.preventDefault();
    var targettabs = $('ul.nav.nav-tabs[data-tabsid]').attr('data-tabsid');
    var $headerwrapper = $('ul.nav.nav-tabs').filter('[data-tabsid="' + targettabs + '"]');
    var $contentwrapper = $('div.tab-content').filter('[data-tabsid="' + targettabs + '"]');

    // handle reload click
    var $active = $headerwrapper.find('li.active').find('a[data-toggle="tab"]');
    var tabid = $active.attr('href');
    var url = $active.attr('data-href');
    var $divcontent = $contentwrapper.find('div' + tabid).first();
    var $iframecontent = $contentwrapper.find('iframe' + tabid).first();

    if ($iframecontent.length > 0) {
      showUrlInTabHandler($iframecontent, url);
    } else if ($divcontent.length > 0) {
      showUrlInTabHandler($divcontent, url);
    }
  };
  //添加新标签页
  var appendTabHandler = function (targettabs, icon, title, tabid, url, closable, tabcontainer) {
    var $headerwrapper = $('ul.nav.nav-tabs').filter('[data-tabsid="' + targettabs + '"]');
    var $contentwrapper = $('div.tab-content').filter('[data-tabsid="' + targettabs + '"]');
    var settings = $headerwrapper.data('bs.tab.gciPlugin.dynamicTab').settings;

    // 添加下拉标签栏
    var ditem = '<li class="active"><a data-target-tabs="[#data-target-tabs#]" data-href="[#url#]" href="#[#tabid#]"><i class="[#icon#] fa-sm"></i> [#title#]</a></li>'
    ditem = ditem.replace("[#tabid#]", tabid).replace("[#url#]", url).replace("[#data-target-tabs#]", targettabs)
      .replace("[#title#]", title).replace("[#icon#]", icon);
    $(ditem).appendTo($('.nav-dynamicTab-dropdown > ul.dropdown-menu')).siblings("li").removeClass("active");

    // 添加主标签栏
    var tabtitle = '<li class=""><a data-toggle="tab" data-target-tabs="[#data-target-tabs#]" data-href="[#url#]" href="#[#tabid#]"><i class="[#icon#]"></i>[#title#]<span class="tab-close"><i class="fa fa-times-circle"></i></span></a></li>';
    if (!closable) {
      tabtitle = tabtitle.replace('<span class="tab-close"><i class="fa fa-times-circle"></i></span>', '');
    }

    function getTitleLen(str) {
      var titleSliceLen = 0,charCode,i;
      for (i = 0; i < str.length; i++)
      {
        if(titleSliceLen>=settings.titleLen*2)break;
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128)
          titleSliceLen += 1;
        else
          titleSliceLen += 2;
      }
      return i;
    }
    title=$.trim(title);
    var slice= getTitleLen(title);
    title = title.substr(0,slice).toString() +(slice===title.length?"" :"..");

    //title += '增加长度以便调试增加长度以便调试';
    $(tabtitle.replace("[#tabid#]", tabid).replace("[#url#]", url).replace("[#data-target-tabs#]", targettabs)
      .replace("[#title#]", title).replace("[#icon#]", icon)).appendTo($headerwrapper);

    if (tabcontainer == "iframe") {
      var tabPanelFmt = '<iframe id="[#tabid#]" class="tab-pane"></iframe>';
      var $content = $(tabPanelFmt.replace("[#tabid#]", tabid).replace("[#url#]", url)
        .replace("[#title#]", title)).appendTo($contentwrapper);
      $content.css({
        "width":"100%",
        "height":"100%",
        "border":"0"
      });
      $content.css("width", "100%");
      $content.css("border", "0");
      //Layout.handle100HeightContent(); // fix content height
      showUrlInTabHandler($content, url);
    }
    else {
      var tabPanelFmt = '<div id="[#tabid#]" class="tab-pane"></div>';
      var $content = $(tabPanelFmt.replace("[#tabid#]", tabid).replace("[#url#]", url)
        .replace("[#title#]", title)).appendTo($contentwrapper);
      showUrlInTabHandler($content, url);
    }
  };
  //加载标签页
  var showUrlInTabHandler = function (tab, url) {
    var $tab = $(tab);
    //Metronic.startPageLoading();
    if ($tab.is('iframe')) {
      //$tab.attr('src', '');
      $tab.attr('src', url);
      $(document).trigger("dymanicTab.start");
      $tab.load(function () {
        //Metronic.stopPageLoading();
        $(document).trigger("dymanicTab.end");
      });
    }
    else {
      $tab.empty();
      $.ajax({
        type: "GET",
        cache: false,
        url: url,
        dataType: "html",
        success: function (res) {
          //Metronic.stopPageLoading();
          $tab.html(res);
          //Layout.fixContentHeight(); // fix content height
          //Metronic.initAjax(); // initialize core stuff
        },
        error: function (xhr, ajaxOptions, thrownError) {
          //Metronic.stopPageLoading();
          $tab.html('<h4>未知错误，内容无法加载</h4>');
        }
      });
    }
  };
  //关闭标签页
  var closeTabHandler = function (e) {
    var $thisli = $(this).closest("li");
    var tabid = $(this).parent().attr('href');
    var targettabs = $(this).parent().attr('data-target-tabs');
    var $headerwrapper = $('ul.nav.nav-tabs').filter('[data-tabsid="' + targettabs + '"]');
    var $contentwrapper = $('div.tab-content').filter('[data-tabsid="' + targettabs + '"]');
    var $dropdownmenu=$('.nav-dynamicTab-dropdown > ul.dropdown-menu');
    if ($thisli.hasClass("active")) {
      if ($thisli.next().length > 0) {
        $thisli.next().find("a[data-toggle='tab']").tab("show");
      } else {
        $thisli.prev().find("a[data-toggle='tab']").tab("show");
      }
    }
    if (tabid != undefined) {
      $('> div' + tabid, $contentwrapper).remove();
      $('> iframe' + tabid, $contentwrapper).remove();
    }
    $dropdownmenu.find('li:has(a[href="' + tabid + '"])').remove();
    $thisli.remove();
  };

  // 通过a链接打开新标签页
  var showLinkHandler = function($link){
    var url = $link.attr("href");
    var targettabs = $link.attr("data-target-tabs");
    // mode will be 'self' or 'tab'
    var mode = $link.attr("data-tabs-dynamic");

    if (mode == 'tab' && targettabs) { // load to url in found tab
      // 可以通过 data-tabclosable 属性来指定 tab 是否可以关闭
      var closable = $link.attr("data-tabclosable") != "false";

      // 可以通过 data-tabid 属性来指定 tabid
      var tabid = $link.attr("data-tabid");
      if ((tabid == "" || tabid == undefined) && url != undefined) {
        tabid = url.toLowerCase().replace(/(\W+)/ig, '');// + Math.random();
      }
      //$link.attr("data-tabid", tabid);

      // 内容可以用 div 和 iframe 来承载，通过属性 data-tabcontainer 来指定，不指定则为
      var tabcontainer = $link.attr("data-tabcontainer");

      // 从 a 中获取 icon
      var icon = null;
      if ($('i[class]', $link).length > 0) {
        icon = $('i[class]', $link).attr("class");

      }

      // 从 a 中获取 title
      var title = $link.text();
      if ($('.title', $link).length > 0) {
        title = $('.title', $link).text();
      }
      showTabHandler(targettabs, icon, title, tabid, url, closable, tabcontainer);
    }
    else { // direct to url in self tab
      var $tab = null;
      if (!targettabs) {
        $tab = $link.parentsUntil('div.tab-pane.active').last().parent();
      } else {
        $tab = $('div.tab-content[data-tabsid="' + targettabs + '"]').find('> div.tab-pane.active');
      }
      if ($tab && $tab.length == 1) {
        showUrlInTabHandler($tab, url);
      }
    }
  };

  var DynamicTab = function (targettabs, settings) {
    this.targettabs = targettabs;
    this.settings = settings;

    if (arguments.length > 0) {
      var $headerwrapper = $('ul.nav-tabs[data-tabsid="' + this.targettabs + '"]');
      this.showTab = function (title, url,tabcontainer, closable, tabid, icon) {
        if (!tabid) {
          tabid = url.toLowerCase().replace(/(\W+)/ig, '');
        }
        showTabHandler(this.targettabs, icon, title, tabid, url, closable, tabcontainer);
      };
      this.closeTab = function (url) {
        if (!url) {
          console.error(url+"is not defined");
          return;
        }
        var tabid = url.toLowerCase().replace(/(\W+)/ig, '');
        var $tab_navbar = $('ul.nav-tabs[data-tabsid="'+targettabs+'"]');
        $tab_navbar.find('a[href="#'+tabid+'"]').find(".tab-close").trigger("click");
        // console.log($tab_navbar);
        // console.log($tab_navbar.find('a[href="#'+tabid+'"]'));
        // console.log($tab_navbar.find('a[href="#'+tabid+'"] .tab-close'));
      };
      // 
      this.showLink = function ($link, tabcontainer) {
        $link.attr('data-target-tabs', this.targettabs);
        if (tabcontainer && !$link.attr('data-tabcontainer')) {
          $link.attr('data-tabcontainer', tabcontainer);
        }
        showLinkHandler($link);
      };
    }
  };

  $.extend({
    gciPlugin: $.extend({
      dynamicTab: function (targettabs, options) {

        if (!$(document).data('bs.tab.gciPlugin.dynamicTab.globalInit')) {
          $(document).data('bs.tab.gciPlugin.dynamicTab.globalInit', true);
          jQuery(document).on("click.bs.tab.gciPlugin.dynamicTab", 'ul.nav.nav-tabs' + '[data-tabsid]' + '> li > a[data-toggle="tab"]' + ' > span.tab-close', closeTabHandler);
          jQuery(document).on('click.bs.tab.gciPlugin.dynamicTab', '.nav-dynamicTab-dropdown> ul.dropdown-menu > li ', dropdownMenuClickHandler);
          jQuery(document).on('click.bs.tab.gciPlugin.dynamicTab', '.nav-dynamicTab-refresh', refreshActiveTabLinksHandler);
          jQuery(document).on('shown.bs.tab.bs.tab.gciPlugin.dynamicTab', 'ul.nav.nav-tabs' + '[data-tabsid]' + '> li > a[data-toggle="tab"]', ajustActiveTabLinksHandler);
          //将下拉列表对应当前标签页
          jQuery(document).on('shown.bs.tab', 'ul.nav.nav-tabs' + '[data-tabsid]' + '> li > a[data-toggle="tab"]', function(){
            var $headerwrapper = $('ul.nav.nav-tabs').filter('[data-tabsid="' + targettabs + '"]');
            var $dropdownmenu=$('.nav-dynamicTab-dropdown > ul.dropdown-menu');
            var c_tabid=$headerwrapper.find(">li.active>a").attr("href");
            $dropdownmenu.find('li:has(a[href="' + c_tabid + '"])').addClass("active").siblings("li").removeClass("active");
            ajustActiveTabLinksHandler();
          });
        }
        if (arguments.length == 0) {
          var data = $(document).data('bs.tab.gciPlugin.dynamicTab');
          if (!data) {
            $(document).data('bs.tab.gciPlugin.dynamicTab', (data = new DynamicTab()));
          }
          return data;
        }
        else {
          var settings = $.extend({
            tabcontainer: 'iframe',
            tabLimit: 10,
            titleLen: 8,//标签栏已定宽8个双字节字符(等同于16个单字节字符)，多余字符显示省略号，设置大于8将导致样式问题
            headerAjust: null
          }, options);

          var $headerwrapper = $('ul.nav.nav-tabs').filter('[data-tabsid="' + targettabs + '"]');
          var data = $headerwrapper.data('bs.tab.gciPlugin.dynamicTab');
          if (!data) {
            $headerwrapper.data('bs.tab.gciPlugin.dynamicTab', (data = new DynamicTab(targettabs, settings)));
          }
          return data;
        }
      }
    }, $.gciPlugin)
  });
  (function() {
    var $tab_navbar = $('ul.nav-tabs[data-tabsid="dynamicTab-window-top-main"]');
    var $tab_content = $('div.tab-content[data-tabsid="dynamicTab-window-top-main"]');
    
    $tab_navbar.width('9999px');
    var heightAjust = function () {
      var neg = $('.main-header').outerHeight();
      var messageRoll=$('.system-message-roll').height();
      var window_height = $(window).height();
      var height = window_height - neg - $tab_navbar.outerHeight()-messageRoll;
      $tab_content.height(height);
    };
    heightAjust();
    //$(document).on('click', '.menu-toggler.sidebar-toggler', headerAjust);
    var resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';
    var timer;
    window.addEventListener(resizeEvent, function() {
    clearTimeout(timer);
    timer = setTimeout(heightAjust, 300);
    }, false);
    //监听消息滚动条
    $(document).on("bs.systemMessageRoll",function(){
      heightAjust();
    });
    window.dynamicTabTopMain = $.gciPlugin.dynamicTab('dynamicTab-window-top-main');
    //window.dynamicTabTopMain.showTab(title, url,tabcontainer, closable, tabid, icon);//标题,url,类型(iframe或其他),是否可关闭，id，图标
    var applyTopMainTabLink = function(selector) {
    jQuery(document).off('click.bs.tab.gciPlugin.dynamicTab', selector);
    jQuery(document).on('click.bs.tab.gciPlugin.dynamicTab', selector, function(e) {
      e.preventDefault();
      window.dynamicTabTopMain.showLink($(this));
    });
    };
    applyTopMainTabLink('a[data-tabs-dynamic]');
  })();
}(jQuery));
