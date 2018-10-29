function fastRangePlugin(pluginConfig) {
	var defaultConfig = {
		btnClass:"btn btn-primary btn-sm"
	};

	var config = {};
	for (var key in defaultConfig) {
		config[key] = pluginConfig && pluginConfig[key] !== undefined ? pluginConfig[key] : defaultConfig[key];
	}

	return function (fp) {
		function dateFormat(dateObj,fmt) { //fmt="yyyy-MM-dd HH:mm:ss"
			var o = {           
			"M+" : dateObj.getMonth()+1, //月份           
			"d+" : dateObj.getDate(), //日           
			"h+" : dateObj.getHours()%12 == 0 ? 12 : dateObj.getHours()%12, //12小时制
			"H+" : dateObj.getHours(), //24小时制
			"m+" : dateObj.getMinutes(), //分           
			"s+" : dateObj.getSeconds(), //秒           
			"q+" : Math.floor((dateObj.getMonth()+3)/3), //季度           
			"S" : dateObj.getMilliseconds() //毫秒           
			};           
			var week = {           
			"0" : "\u65e5",           
			"1" : "\u4e00",           
			"2" : "\u4e8c",           
			"3" : "\u4e09",           
			"4" : "\u56db",           
			"5" : "\u4e94",           
			"6" : "\u516d"          
			};           
			if(/(y+)/.test(fmt)){           
				fmt=fmt.replace(RegExp.$1, (dateObj.getFullYear()+"").substr(4 - RegExp.$1.length));           
			}           
			if(/(E+)/.test(fmt)){           
				fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[dateObj.getDay()+""]);           
			}           
			for(var k in o){           
				if(new RegExp("("+ k +")").test(fmt)){           
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));           
				}           
			}           
			return fmt;           
		};
		function today(now){
			return {
				start:dateFormat(now,"yyyy-MM-dd")+" 00:00:00",
				end:dateFormat(now,"yyyy-MM-dd")+" 23:59:59"
			}
		}
		function yestoday(now){
			var dateTmp=new Date(now.getTime()-1000*60*60*24);
			return {
				start:dateFormat(dateTmp,"yyyy-MM-dd")+" 00:00:00",
				end:dateFormat(dateTmp,"yyyy-MM-dd")+" 23:59:59"
			}
		}
		function sevenDay(now){
			var dateTmp=new Date(now.getTime()-1000*60*60*24*7);
			return {
				start:dateFormat(dateTmp,"yyyy-MM-dd")+" 00:00:00",
				end:dateFormat(now,"yyyy-MM-dd")+" 23:59:59"
			}
		}
		function thisMonth(now){
			var lastDay=new Date(now.getTime()-1000*60*60*24*7);
			return {
				start:dateFormat(now,"yyyy-MM")+"-01 00:00:00",
				end:dateFormat(new Date(now.getFullYear(),(now.getMonth()+1),0),"yyyy-MM-dd")+" 23:59:59"
			}
		}
		function prevMonth(now){
			var year = now.getFullYear();
			var month = now.getMonth();
			if(month==0){
				month=12;
				year=year-1;
			}
			if (month < 11) {
				month = "0" + month;
			}
			var lastDay = new Date(year, month, 0);
			return {
				start:year + "-" + month + "-" + "01 00:00:00",
				end:year + "-" + month + "-" + lastDay.getDate()+" 23:59:59"
			}
		}
		var buttons='';
		buttons+='<button type="button" class="'+config.btnClass+'" style="margin-right:4px" data-range="today">今天</button>';
		buttons+='<button type="button" class="'+config.btnClass+'" style="margin-right:4px" data-range="yestoday">昨天</button>';
		buttons+='<button type="button" class="'+config.btnClass+'" style="margin-right:4px" data-range="sevenDay">最近七天</button>';
		buttons+='<button type="button" class="'+config.btnClass+'" style="margin-right:4px" data-range="thisMonth">本月</button>';
		buttons+='<button type="button" class="'+config.btnClass+'" style="margin-right:4px" data-range="prevMonth">上月</button>';
		return {
			onReady: function onReady() {
				if (fp.calendarContainer === undefined) return;

				fp.btnContainer = fp._createElement("div", "flatpickr-fastRange", "");
				fp.btnContainer.style.padding="10px";
				fp.btnContainer.style.background="#fff";
				fp.btnContainer.innerHTML += buttons;

				fp.btnContainer.addEventListener("click",function(e){
					var range=e.target.getAttribute("data-range");
					var start,end,separator=fp.l10n.rangeSeparator,mode=fp.config.mode,now=new Date();
					var rangeFmt;
					if(range==="today"){
						rangeFmt=today(now);
						start=fp.formatDate(new Date(rangeFmt.start),fp.config.dateFormat);
						end=fp.formatDate(new Date(rangeFmt.end),fp.config.dateFormat);
						fp.input.value=mode==="range"?start+separator+end:start;
					}else if(range==="yestoday"){
						rangeFmt=yestoday(now);
						start=fp.formatDate(new Date(rangeFmt.start),fp.config.dateFormat);
						end=fp.formatDate(new Date(rangeFmt.end),fp.config.dateFormat);
						fp.input.value=mode==="range"?start+separator+end:start;
					}else if(range==="sevenDay"){
						rangeFmt=sevenDay(now);
						start=fp.formatDate(new Date(rangeFmt.start),fp.config.dateFormat);
						end=fp.formatDate(new Date(rangeFmt.end),fp.config.dateFormat);
						fp.input.value=mode==="range"?start+separator+end:start;
					}else if(range==="thisMonth"){
						rangeFmt=thisMonth(now);
						start=fp.formatDate(new Date(rangeFmt.start),fp.config.dateFormat);
						end=fp.formatDate(new Date(rangeFmt.end),fp.config.dateFormat);
						fp.input.value=mode==="range"?start+separator+end:start;
					}else if(range==="prevMonth"){
						rangeFmt=prevMonth(now);
						start=fp.formatDate(new Date(rangeFmt.start),fp.config.dateFormat);
						end=fp.formatDate(new Date(rangeFmt.end),fp.config.dateFormat);
						fp.input.value=mode==="range"?start+separator+end:start;
					}
					fp.close();
				});
				fp.calendarContainer.appendChild(fp.btnContainer);
			}
		};
	};
}

if (typeof module !== "undefined") module.exports = fastRangePlugin;