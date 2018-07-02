var util = require('./util.js');
var md5 = require('./md5.js');
var $ = require('./ajax.js');

/**
 * 对象转换为字符串
 * @example {a: 'kobe', b: 'iverson'} ---> 'a=kobe&b=iverson'
 */
var objToStr = (obj) => {
  let str = '';
  let keys = Object.keys(obj);
  keys = keys.sort();     // 按ASCII码排序
  for(let i=0; i<keys.length; i++) {
    str += `&${keys[i]}=${obj[keys[i]]}`;
  }
  str = str.substr(1);
  return str;
}

/**
 * 生成签名
 */
var getPaySign = (obj) => {
  let str = objToStr(obj);
  str = str +'&key=vi4R8To6D9a2od2SDowz6Jl85anLnNec';  
  console.log(str);
  let md5Str = md5(str).toUpperCase();
  return md5Str;
}
module.exports = {
  getPaySign: getPaySign
} 

