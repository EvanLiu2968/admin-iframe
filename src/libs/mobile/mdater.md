#mdater自定义日期控件#

###使用说明###
```html
<link rel="stylesheet" href="/src/libs/mobile/mdater.css">
<script src="/src/libs/mobile/mdater.js"></script>
<input type="text" id="mdater" name="date"/>

```
```javascript
$("#mdater").mdater({
    toggleYear:false,  //true显示切换年，false则只显示切换月
    minDate:new Date(),  //最小日期
    maxDate:new Date(new Date().valueOf() + 45*24*60*60*1000)  //最大日期
})

```
###事件###
```javascript
$("#mdater").on("datechange",function(){
    //控件选择日期改变
})
//mdater绑定input click事件
```