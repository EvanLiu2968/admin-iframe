/*
 * Created by evanliu2968 on 2017/01/01.
 */
$(function() {
  index.init();
});
var index = (function() {
  //组件；
  var componentInit = function() {
    //首页左侧下拉菜单
    var treeviewmenuToggle = function(menu) {
      var animationSpeed = 200;
      $(document).on('click', menu + ' li a', function(e) {
        //Get the clicked link and the next element
        var $this = $(this);
        var checkElement = $this.next();

        //Check if the next element is a menu and is visible
        if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible'))) {
          //Close the menu
          checkElement.slideUp(animationSpeed, function() {
            checkElement.removeClass('menu-open');
            //Fix the layout in case the sidebar stretches over the height of the window
            //_this.layout.fix();
          });
          checkElement.parent("li").removeClass("active");
        }
        //If the menu is not visible
        else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
          //Get the parent menu
          var parent = $this.parents('ul').first();
          //Close all open menus within the parent
          var ul = parent.find('ul:visible').slideUp(animationSpeed);
          //Remove the menu-open class from the parent
          ul.removeClass('menu-open');
          //Get the parent li
          var parent_li = $this.parent("li");

          //Open the target menu and add the menu-open class
          checkElement.slideDown(animationSpeed, function() {
            //Add the class active to the parent li
            checkElement.addClass('menu-open');
            parent.find('>li.active').removeClass('active');
            parent_li.addClass('active');
          });
        }
        //if this isn't a link, prevent the page from being redirected
        if (checkElement.is('.treeview-menu')) {
          e.preventDefault();
        }
      });
    };
    //显示/隐藏菜单
    var sidebarToggle = function() {
      $(".sidebar-toggle").on('click', function(e) {
        e.preventDefault();
        $("body").toggleClass("sidebar-collapse");
      });
    };
    //对侧边栏总模块添加active类
    var treeviewmenuActiveShow = function(menu) {
      $(document).on('click', menu + ' li a', function(e) {
        //Get the clicked link and the next element
        var $this = $(this);
        var checkElement = $this.next();
        //console.log(checkElement.is('.treeview-menu'));
        //Check if the next element is a menu and is visible
        if (!checkElement.is('.treeview-menu')) {
          var treeviewLi = $this.parents('.treeview');
          treeviewLi.addClass("active").siblings(".active").removeClass("active");
        }
      });
    };
    //iframe标签页切换监听
    var tabToggleHandle = function() {
      $('.nav-dynamicTab-container').on('shown.bs.tab', 'a[data-toggle="tab"]', function(e) {
        var pathname = $(e.target).data('href').toLowerCase();
        var moduelname = pathname.split("/")[1];
        //console.log(pathname);
        //console.log(moduelname);
        var $targetLi = $('.sidebar-menu>li[data-moduel="' + pathname + '"]');
        if ($targetLi.length === 0) {
          if (moduelname === 'authen') moduelname = 'todo';
          $('.sidebar-menu>li[data-moduel="' + moduelname + '"]').addClass("active").siblings('.active').removeClass('active');
        } else if ($targetLi.length === 1) {
          $targetLi.addClass("active").siblings('.active').removeClass('active');
        }
      });
    };
    //对二级菜单栏位置矫正，使之最低不低于屏幕视口
    var treeviewmenuOffsetShow = function() {
      $(".sidebar-menu>li.treeview").on("mouseenter", function(e) {
        var $self = $(this);
        var winH = $(window).height();
        var $menu = $self.find(">ul.treeview-menu");
        //如果二级菜单低于屏幕视口
        if ($menu.length === 0) return;
        if ((winH - $menu.offset().top) < $menu.height()) {
          $menu.css("margin-top", $self.height() - $menu.height() - 8 + "px");
        }
      })
    };
    //检测窗口宽度
    var windowCollapse = function() {
      var windowAjust = function() {
        var win_w = $(window).width();
        //console.log(win_w);
        if (win_w <= 1200) {
          $("body").addClass("sidebar-collapse");
          //$(".sidebar-toggle").off('click');
        } else {
          $("body").removeClass("sidebar-collapse");
          //sidebarToggle();
        }
      };
      var resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';
      var timer;
      window.addEventListener(resizeEvent, function() {
        clearTimeout(timer);
        timer = setTimeout(windowAjust, 300);
      }, false);
      windowAjust();
    };
    treeviewmenuToggle('.sidebar');
    treeviewmenuActiveShow('.sidebar');
    windowCollapse();
    sidebarToggle();
  };

  var buttonActionInit = function() {
    //公告栏
    $("#btn-notice").on("click", function() {
      common.openTab("./Authen/noticeBoard.html", "公告栏");
      $("#messageCount").text("");
    });
    //公告栏
    $("#btn-feedback").on("click", function() {
      common.openTab("./Authen/questionFeedback.html", "问题反馈");
    })
  };
  //页面初始化
  var pageInit = function() {
    //iframe加载进度条显示
    $(document).on("dymanicTab.start", function() {
      NProgress.start();
    }).on("dymanicTab.end", function() {
      NProgress.done();
    });
    //首页默认打开带start类的菜单
    $('.sidebar-menu li>a.start').eq(0).trigger("click");
  };
  //系统消息提示滚动栏组件封装
  var systemMessageRoll = (function() {
    var $component = $("#system-message-roll");
    var $wrapper = $(".message-list-wrapper");
    var timer, rolling;
    return {
      start: function(list, option) {
        var config = {
          type: "h", //h:水平，v:垂直
          hStep: 1, //水平滚动每一步的像素
          hInterval: 10, //水平滚动每一步的时间间隔
          vInterval: 2000 //垂直滚动每一次的时间间隔
        }; //默认配置
        config = $.extend(config, option);
        clearInterval(timer);
        setTimeout(function() {
          $(document).trigger("bs.systemMessageRoll");
        }, 350);
        if (config.type == "h") {
          list = '<div class="message-list-h">' + list + '</div>';
          var $list1 = $(list);
          var $list2 = $(list);
          $wrapper.find(".message-list-h").remove();
          if (!$component.hasClass("rolling")) {
            $component.addClass("rolling");
          }
          $wrapper.append($list1);
          rolling = function() {
            var left = parseInt($list1.css("left"));
            var lastLi = $list1.find("a:last");
            if (lastLi.offset().left <= $wrapper.offset().left && $wrapper.find(".message-list-h").length <= 1) {
              $wrapper.append($list2);
            } else if ((lastLi.offset().left + lastLi.width()) <= $wrapper.offset().left) {
              $list1.remove();
              $list1 = $list2;
              $list2 = $(list);
              left = parseInt($list1.css("left"));
            }
            $list1.css("left", (left - config.hStep) + "px");
          };
          timer = setInterval(rolling, config.hInterval);
          $wrapper.on("mouseenter", function() {
            clearInterval(timer);
          }).on("mouseleave", function() {
            timer = setInterval(rolling, config.hInterval)
          });
        } else if (config.type == "v") {
          //垂直滚动
          list = '<div class="message-list-v">' + list + '</div>';
          var $list = $(list);
          var height = 32;
          $wrapper.find(".message-list-v").remove();
          if (!$component.hasClass("rolling")) {
            $component.addClass("rolling");
          }
          $wrapper.append($list);
          var listLength = $wrapper.find("a").length;
          var firstLi = $wrapper.find("a:first");
          $wrapper.find(".message-list-v").append(firstLi.clone());
          rolling = function() {
            var top = parseInt($list.css("top"));
            //console.log($list.css("top"));
            $list.animate({
              top: top - height
            }, "normal", "linear", function() {
              if ((-top) === (listLength - 1) * height) {
                $list.css("top", "0")
              }
            })

          };
          timer = setInterval(rolling, config.vInterval);
          $wrapper.on("mouseenter", function() {
            clearInterval(timer);
          }).on("mouseleave", function() {
            timer = setInterval(rolling, config.vInterval)
          });
        }
      },
      close: function() {
        clearInterval(timer);
        $component.removeClass("rolling");
        $wrapper.off("mouseenter mouseleave");
        setTimeout(function() {
          $(document).trigger("bs.systemMessageRoll");
        }, 350);
      }
    }
  })();
  //顶栏消息推送滚动
  var getMessageRoll = function() {
    //系统消息提示滚动栏组件初始化,不确定数据结构，html在外部生成
    var content = '<a>外国领导人、政党和组织祝贺十九大召开</a>' +
      '<a>习近平在参加党的十九大贵州省代表团讨论时强调 万众一心开拓进取 把新时代中国特色社会主义推向前进</a>' +
      '<a>进入新时代！习近平这19个新提法你一定要知道</a>';
    setTimeout(function() {
      systemMessageRoll.start(content, {
        type: "v",
        vInterval: 2000
      })
    }, 3000);
    $(".roll-close").click(function() {
      systemMessageRoll.close();
      setTimeout(function() {
        systemMessageRoll.start(content, {
          type: "v",
          vInterval: 2000
        })
      }, 100000);
    });
    $("#system-message-roll").on("click", ".message-list>a", function() {
      $("#btn-notice").trigger("click");
    })
  };
  return {
    init: function() {
      componentInit();
      buttonActionInit();
      pageInit();
      getMessageRoll();
    }
  }
})();