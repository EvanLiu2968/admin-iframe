/*
 * 参考携程搜索条件a标签href赋值
 * 格式为：key_value-key_value
 * 示例param：star_1-star_2-month_12
*/
const map={
  addr:'addr',   //位置
  star:'',   //星级
  theme:'',  //主题
  brand:'',  //品牌
  pricestart:'', //开始价格
  priceend:'',   //结束价格
  month:'',  //月份
  year:'',   //年份
  param6:'',   //星级
  param7:'',   //星级
  param8:'',   //星级
  param9:''  //星级
}
//将当前url参数结合当前a链接参数拼接成新的url参数
function serialize(oparam,config){
  var paramMap=format(oparam);
  for(let key in config){
  if(paramMap[key]){
  let arr=paramMap[key].split(',');
  arr.push(config[key])
  paramMap[key]=arr.join(',')
  }else{
  paramMap[key]=config[key]+''
  }
  }
  return joinParam(paramMap)
}
// serialize('star_1-star_2',{month:12})=>'star_1-star_2-month_12'

//将当前url参数结合当前a链接参数拼接成新的url参数
function format(param){
  var paramMap=param.split('-').reduce(function(acc,v,i,a){
  let key=v.split('_')[0],value=v.split('_')[1];
  if(acc[key]){
  let arr=acc[key].split(',')
  arr.push(value)
  acc[key]=arr.join(',')
  }else{
  acc[key]=value+''
  }
  return acc
  },{})
  return paramMap
}
// format('star_1-star_2-month_12')=>
// {
//   star:'1,2',
//   month:'12'
// }
function joinParam(paramMap){
  var param=[];
  for(let key in paramMap){
  paramMap[key].split(',').forEach((v)=>{
  param.push(key+'_'+v)
  })
  }
  return param.join('-')
}
// export default {
//   map:map,
//   format:format,
//   serialize:serialize,
//   joinParam:joinParam
// }