/*
 * Created by evanliu2968 on 2016/11/8. github:https://github.com/EvanLiu2968
 * 常用代码段
 */
//rem.js  手机端使用rem时的根字体初始化
(function(win) {
	var docEl = win.document.documentElement;
	var resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';
	var timer;

	function refreshRem() {
		// var width = docEl.clientWidth;
		var width = docEl.getBoundingClientRect().width || docEl.clientWidth;
		// if (width > 540) { // 最大宽度
		// 	width = 540;
		// }
		var rem = width / 10; // 将屏幕宽度分成10份，1份为1rem
		docEl.style.fontSize = rem + 'px';
	}
	refreshRem();
	win.addEventListener(resizeEvent, function() {
		clearTimeout(timer);
		timer = setTimeout(refreshRem, 300);
	}, false);
})(window);

// viewport.js  用viewport的缩放功能适配手机端
(function() {
	function isMobile() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(navigator.userAgent)
	}

	function setScale() {
		if (window.top !== window) {
			return;
		}
		var pageScale = 1;
		var width = window.screen.availWidth || document.documentElement.clientWidth;
		//兼容UC window.innerHeight与document.documentElement.clientWidth不对等
		pageScale = width / 750;
		//console.log('screen.width', width, 'screen.height', height, 'setScale', pageScale);
		// meta
		var content = 'width=device-width, initial-scale=' + pageScale + ', maximum-scale=' + pageScale + ', user-scalable=no';
		document.getElementById('viewport').setAttribute('content', content);
	}
	if (isMobile()) {
		setScale();
	}
})();