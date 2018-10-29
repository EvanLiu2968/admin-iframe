/*定义tab事件,将touchstart和click转化为tap事件*/
!!function(a){var b={},c={};c.attachEvent=function(b,c,d){return"addEventListener"in a?b.addEventListener(c,d,!1):void 0},c.fireFakeEvent=function(a,b){return document.createEvent?a.target.dispatchEvent(c.createEvent(b)):void 0},c.createEvent=function(b){if(document.createEvent){var c=a.document.createEvent("HTMLEvents");return c.initEvent(b,!0,!0),c.eventName=b,c}},c.getRealEvent=function(a){return a.originalEvent&&a.originalEvent.touches&&a.originalEvent.touches.length?a.originalEvent.touches[0]:a.touches&&a.touches.length?a.touches[0]:a};var d=[{test:("propertyIsEnumerable"in a||"hasOwnProperty"in document)&&(a.propertyIsEnumerable("ontouchstart")||document.hasOwnProperty("ontouchstart")),events:{start:"touchstart",move:"touchmove",end:"touchend"}},{test:a.navigator.msPointerEnabled,events:{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}},{test:a.navigator.pointerEnabled,events:{start:"pointerdown",move:"pointermove",end:"pointerup"}}];b.options={eventName:"tap",fingerMaxOffset:11};var e,f,g,h,i={};e=function(a){return c.attachEvent(document.body,h[a],g[a])},g={start:function(a){a=c.getRealEvent(a),i.start=[a.pageX,a.pageY],i.offset=[0,0]},move:function(a){return i.start||i.move?(a=c.getRealEvent(a),i.move=[a.pageX,a.pageY],void(i.offset=[Math.abs(i.move[0]-i.start[0]),Math.abs(i.move[1]-i.start[1])])):!1},end:function(d){if(d=c.getRealEvent(d),i.offset[0]<b.options.fingerMaxOffset&&i.offset[1]<b.options.fingerMaxOffset&&!c.fireFakeEvent(d,b.options.eventName)){if(a.navigator.msPointerEnabled||a.navigator.pointerEnabled){var e=function(a){a.preventDefault(),d.target.removeEventListener("click",e)};d.target.addEventListener("click",e,!1)}d.preventDefault()}i={}},click:function(a){return c.fireFakeEvent(a,b.options.eventName)?void 0:a.preventDefault()}},f=function(){for(var a=0;a<d.length;a++)if(d[a].test)return h=d[a].events,e("start"),e("move"),e("end"),!1;return c.attachEvent(document.body,"click",g.click)},c.attachEvent(a,"load",f),a.Tap=b}(window);

if(window.jQuery||window.Zepto) {
	(function($){
		//为$扩展一个方法，以配置的方式代理事件
		$.fn.delegates = function(arr) {
			var el = $(this[0]);
			arr.forEach(function(v){
				el.on(v.event, v.target, v.callback)
			});
			return this;
		};
		var mdater = function (selector, config){
			var defaults = {
				trigger:"tap",
				toggleYear:true,  //true显示切换年，false则只显示切换月
				maxDate : null,
				minDate : new Date(1970, 0, 1)
			};
			this.option = $.extend(defaults, config);
			this.$input = $(selector);
			//通用函数
			this.until={
				//计算某年某月有多少天
				getDaysInMonth : function(year, month){
					return new Date(year, month+1, 0).getDate();
				},
				//计算某月1号是星期几
				getWeekInMonth : function(year, month){
					return new Date(year, month, 1).getDay();
				},
				getMonth : function(m){
					return ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'][m];
				},
				//计算年某月的最后一天日期
				getLastDayInMonth : function(year, month){
					return new Date(year, month, this.getDaysInMonth(year, month));
				}
			};
			this.value={
				year : '',
				month : '',
				date : ''
			};
			this.split="-";
			this.lastCheckedDate="";
			this.renderHTML();
			this.initListeners();
			return this
		};
		mdater.prototype={
			renderHTML : function(){
				var $html,id="md"+new Date().getTime();
				if(this.option.toggleYear){
					$html = $('<div class="md_mask" id="'+id+'"><div class="md_panel"><div class="md_head">' +
						'<div class="md_selectarea"><i class="md_prev change_year fa fa-angle-double-left"></i><span class="md_headtext yeartag" >月</span> <i class="md_next change_year fa fa-angle-double-right" ></i></div>' +
						'<div class="md_selectarea"><i class="md_prev change_month fa fa-angle-double-left"></i> <span class="md_headtext monthtag">月</span> <i class="md_next change_month fa fa-angle-double-right"></i></div></div>' +
						'<div class="md_body"><ul class="md_weekarea"><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul>' +
						'<div class="md_datearea_wrap"><ul class="md_datearea in"></ul></div></div></div>');
				}else{
					$html = $('<div class="md_mask" id="'+id+'"><div class="md_panel"><div class="md_head"><div class="md_selectarea">' +
						'<i class="md_prev change_month fa fa-angle-double-left"></i><span class="md_headtext monthtag" >月</span>' +
						'<i class="md_next change_month fa fa-angle-double-right" ></i></div></div><div class="md_body">' +
						'<ul class="md_weekarea"><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul>' +
						'<div class="md_datearea_wrap"><ul class="md_datearea in"></ul></div></div></div></div>');
				}
				$(document.body).append($html);
				var $md=$("#"+id);
				this.$md=$md;
				this.$panel=$md.find(".md_panel");
				this.$monthTag=$md.find(".md_selectarea .monthtag");
				this.$yearTag=$md.find(".md_selectarea .yeartag");
				this.$dateAreaWrap=$md.find(".md_datearea_wrap");
			},
			_showPanel : function(container){
				this.refreshView();
				this.$md.addClass('show');
			},
			_hidePanel : function(){
				this.$md.removeClass('show');
			},
			_changeMonth : function(add, checkDate){

				//先把已选择的日期保存下来
				this.saveCheckedDate();

				var monthTag =this.$monthTag,
					num = ~~monthTag.data('month')+add;
				//月份变动发生了跨年
				if(num>11){
					num = 0;
					this.value.year++;
					monthTag.text(this.value.year+this.value.month).data('year', this.value.year);
				}
				else if(num<0){
					num = 11;
					this.value.year--;
					monthTag.text(this.value.year+this.value.month).data('year', this.value.year);
				}
				var nextMonth=this.option.toggleYear?(this.until.getMonth(num)+'月'):(this.value.year+'年 '+this.until.getMonth(num)+'月');
				monthTag.text(nextMonth).data('month', num);
				this.value.month = num;
				if(checkDate){
					this.value.date = checkDate;
				}
				else{
					//如果有上次选择的数据，则进行赋值
					this.setCheckedDate();
				}
				this.updateDate(add);
			},
			_changeYear : function(add){
				//先把已选择的日期保存下来
				this.saveCheckedDate();
				var yearTag =this.$yearTag,
					num = ~~yearTag.data('year')+add;
				yearTag.text(num+'年').data('year', num);
				this.value.year = num;

				this.setCheckedDate();

				this.updateDate(add);
			},
			//保存上一次选择的数据
			saveCheckedDate : function(){
				if(this.value.date){
					this.lastCheckedDate = {
						year : this.value.year,
						month : this.value.month,
						date : this.value.date
					}
				}
			},
			//将上一次保存的数据恢复到界面
			setCheckedDate : function(){
				if(this.lastCheckedDate && this.lastCheckedDate.year==this.value.year && this.lastCheckedDate.month==this.value.month){
					this.value.date = this.lastCheckedDate.date;
				}
				else{
					this.value.date = '';
				}
			},
			//根据日期得到渲染天数的显示的HTML字符串
			getDateStr : function(y, m, d){
				var dayStr = '';
				//计算1号是星期几，并补上上个月的末尾几天
				var week = this.until.getWeekInMonth(y, m);
				var lastMonthDays = this.until.getDaysInMonth(y, m-1);
				for(var h=week-1; h>=0; h--){
					//dayStr += '<li class="prevdate" data-day="'+(lastMonthDays-h)+'">'+(lastMonthDays-h)+'</li>';
					dayStr += '<li class="disabled" data-day="'+(lastMonthDays-h)+'"></li>';
				}
				//再补上本月的所有天;
				var currentMonthDays = this.until.getDaysInMonth(y, m);
				//判断是否超出允许的日期范围
				var startDay = 1,
					endDay = currentMonthDays,
					thisDate = new Date(y, m, d),
					firstDate = new Date(y, m, 1),
					lastDate =  new Date(y, m, currentMonthDays),
					minDateDay = this.option.minDate.getDate();


				if(this.option.minDate>lastDate){
					startDay = currentMonthDays+1;
				}
				else if(this.option.minDate>=firstDate && this.option.minDate<=lastDate){
					startDay = minDateDay;
				}

				if(this.option.maxDate){
					var maxDateDay = this.option.maxDate.getDate();
					if(this.option.maxDate<firstDate){
						endDay = startDay-1;
					}
					else if(this.option.maxDate>=firstDate && this.option.maxDate<=lastDate){
						endDay = maxDateDay;
					}
				}


				//将日期按允许的范围分三段拼接
				for(var i=1; i<startDay; i++){
					dayStr += '<li class="disabled" data-day="'+i+'">'+i+'</li>';
				}
				for(var j=startDay; j<=endDay; j++){
					var current = '';
					if(y==this.value.year && m==this.value.month && d==j){
						current = 'current';
					}
					if(j==new Date().getDate()&&this.value.month==new Date().getMonth()){
						dayStr += '<li class="now '+current+'" data-day="'+j+'" >今天</li>';
					}else{
						dayStr += '<li class="'+current+'" data-day="'+j+'">'+j+'</li>';
					}
				}
				for(var k=endDay+1; k<=currentMonthDays; k++){
					dayStr += '<li class="disabled" data-day="'+k+'">'+k+'</li>';
				}

				//再补上下个月的开始几天
				var nextMonthStartWeek = (currentMonthDays + week) % 7;
				if(nextMonthStartWeek!==0){
					for(var l=1; l<=7-nextMonthStartWeek; l++){
						//dayStr += '<li class="nextdate" data-day="'+l+'">'+l+'</li>';
						dayStr += '<li class="disabled" data-day="'+l+'"></li>';
					}
				}

				return dayStr;
			},
			updateDate : function(add){
				var dateArea = this.$md.find(".md_datearea.in");
				var dateAreaWrap = this.$dateAreaWrap;
				var c1,c2;
				if(add == 1){
					c1 = 'out_left';
					c2 = 'out_right';
				}
				else{
					c1 = 'out_right';
					c2 = 'out_left';
				}
				var newDateArea = $('<ul class="md_datearea '+c2+'"></ul>');
				newDateArea.html(this.getDateStr(this.value.year, this.value.month, this.value.date));
				dateAreaWrap.append(newDateArea);
				setTimeout(function(){
					newDateArea.removeClass(c2).addClass('in');
					dateArea.removeClass('in').addClass(c1);
				}, 0);

			},
			//每次调出panel前，对界面进行重置
			refreshView : function(){
				var dateArea = this.$md.find(".md_datearea");
				var monthTag = this.$monthTag;
				var yearTag = this.$yearTag;
				var initVal = this.$input.val(),
					date = null;
				if(initVal){
					date = new Date(initVal);
					this.value.year=date.getFullYear();
					this.value.month=date.getMonth();
					this.value.date=date.getDate();
				}
				else{
					date = new Date();
				}

				var y = this.value.year = date.getFullYear(),
					m = this.value.month = date.getMonth(),
					d = this.value.date = date.getDate();
				yearTag.text(y+'年').data('year', y);
				var monthTagText =this.option.toggleYear?(this.until.getMonth(m)+'月'):(y+'年 '+this.until.getMonth(m)+'月');
				monthTag.text(monthTagText).data('month', m);
				var dayStr = this.getDateStr(y, m, d);
				dateArea.html(dayStr);
			},
			initListeners : function(){
				var _this = this,
					panel = _this.$panel,
					mask = _this.$md;
				_this.$input.on(_this.option.trigger, function(){
					if(mask.hasClass('show')){
						_this._hidePanel();
					}
					else{
						_this._showPanel();
					}
				});

				mask.on(_this.option.trigger, function(e){
					_this._hidePanel();
				});

				panel.delegates([
					{
						target: '.change_month',
						event: _this.option.trigger,
						callback: function (e) {
							e.stopPropagation();
							var add = $(this).hasClass('md_next') ? 1 : -1;
							_this._changeMonth(add);
						}
					},
					{
						target: '.change_year',
						event: _this.option.trigger,
						callback: function (e) {
							e.stopPropagation();
							var add = $(this).hasClass('md_next') ? 1 : -1;
							_this._changeYear(add);
						}
					},
					{
						target: '.out_left, .out_right',
						event: 'webkitTransitionEnd',
						callback: function (e) {
							$(this).remove();
						}
					},
					{
						target: '.md_datearea li',
						event: _this.option.trigger,
						callback: function (e) {
							e.stopPropagation();
							var $this = $(this);
							if($this.hasClass('disabled')){
								return;
							}
							_this.value.date = $this.data('day');
							//判断是否点击的是前一月或后一月的日期
							var add = 0;
							if($this.hasClass('nextdate')){
								add = 1;
							}
							else if($this.hasClass('prevdate')){
								add = -1;
							}

							if(add !== 0){
								_this._changeMonth(add, _this.value.date);
							}else{
								if(!$this.hasClass('current')){
									$this.addClass('current').siblings('.current').removeClass('current');
									var monthValue = _this.value.month + 1;
									if(monthValue < 10){
										monthValue = '0' + monthValue;
									}
									var dateValue = _this.value.date;
									if(dateValue === ''){
										dateValue = _this.value.date = 1;
									}
									if(dateValue < 10){
										dateValue = '0' + dateValue;
									}
									_this.$input.val(_this.value.year + _this.split + monthValue + _this.split + dateValue);
									_this.$input.trigger('datechange');
								}
								_this._hidePanel();
							}
						}
					}
				]);
			}
		};
		$.fn.mdater = function (params) {
			var that = $(this);
			var instance = new mdater(that[0], params);
			return that;
		};
	})(window.jQuery||window.Zepto);
}