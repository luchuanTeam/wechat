const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 去除参数的前后空格
 */
const trim = (str)=> {
  if(str !== null && str !== undefined) {
    if(typeof str === 'string') {   //接收的参数必须是字符格式
      str = str.replace(/(^\s*)|(\s*$)/g, '');
      return str;
    } else {
      return str;
    }
  } else {
    return '';
  }
}

module.exports = {
  formatTime: formatTime,
  trim: trim
}
