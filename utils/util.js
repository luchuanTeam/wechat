const domain = 'https://www.yanda123.com';
const strArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 
'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

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
 * @param str: 要求传入的参数为字符串，否则直接返回
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
};

/**
 * 将换行符替换为逗号
 * @param str: 要求传入的参数为字符串，否则直接返回
 */
const formatLine = (str)=> {
  if (str !== null && str !== undefined) {
    if (typeof str === 'string') {   //接收的参数必须是字符格式
      str = str.replace(/[\n\r]/g, ',');
      return str;
    } else {
      return str;
    }
  } else {
    return '';
  }
}

const getAttachSrc = (attchment) => {
  let filePath = attchment.filePath;
  let fileName = attchment.newFilename;
  let ext = attchment.fileExt;
  filePath = filePath.substring(filePath.indexOf('/video')); 
  return domain + filePath + '/' + fileName + '.' + ext;
}

/**
 * 快捷提示框
 * @param str: 快捷提示标语
 * @param icon: 图标，有效值只能为 'success', 'loading', 'none' 默认值为 'none'
 * @param time: 快捷提示框显示时间 默认值设为 1000 毫秒
 * @param fun: 回调函数, 提示框消失后执行
 */
const quickTip = (str, icon, time, fun)=> {
  if(!str) {
    return;
  }
  if(icon !== 'success' || icon !== 'loading') {
    icon = 'none'
  }
  !time && (time = 1000);
  wx.showToast({
    title: str,
    icon: icon,
    mask: true,
    complete: () => {
      setTimeout(function () {
        wx.hideToast();
        if(fun && typeof fun === 'function') {
          fun();
        }
      }, time)
    }
  });
}

/**
 * 秒转时间  例：125 => 02:05
 */
const secondsToTime = (duration) => {
  let time = "";
  let minute = Math.floor(duration / 60);
  let seconds = Math.floor(duration % 60);
  if (minute < 10) {
    time += "0";
  }
  time += minute + ":";
  if (seconds < 10) {
    time += "0";
  }
  time += seconds;
  return time; 
}

/**
 * 获取今天的日期
 */
const getToday = () => {
  let t = new Date();
  return t.getFullYear() + '-' + formatNumber((t.getMonth() + 1)) + '-' + formatNumber((t.getDate()));
}

const getTodayStr = () => {
  let t = new Date();
  let str = t.getFullYear() + '' + formatNumber((t.getMonth() + 1)) + formatNumber(t.getDate()) +
    formatNumber(t.getHours()) + formatNumber(t.getMinutes()) +formatNumber(t.getSeconds()); 
  return str;
} 

/**
 * 判断输入的日期 是否为今天的日期
 * 输入格式为 2018-05-15 2018-05-02
 */
const isToday = (str)=>{
  if(typeof str !== 'string') {
    return false;
  }
  str = trim(str);
  if(!str || str.length < 10) {
    return false;
  }
  str = str.slice(0,10);
  let reg = /^\d{4}-\d{2}-\d{2}$/;  
  if(!reg.test(str)) {   // 只接受 '2018-06-14' 这种格式
    return false;
  }
  return new Date(getToday()).getTime() - new Date(str).getTime() === 0;
}

/**
 * 判断输入日期是否为昨天
 * 输入格式为 2018-05-15 2018-05-02
 */
const isYesterday = (str)=> {
  if (typeof str !== 'string') {
    return false;
  }
  str = trim(str);
  if (!str || str.length < 10) {
    return false;
  }
  str = str.slice(0, 10);
  let reg = /^\d{4}-\d{2}-\d{2}$/;
  if (!reg.test(str)) {   // 只接受 '2018-06-14' 这种格式
    return false;
  }
  let t1 = new Date(getToday()).getTime();
  let t2 = new Date(str).getTime();
  if (t1 - t2 > 0 && t1 - t2 <= 86400000 ) {
    return true;
  } else {
    return false;
  }
}

const isVip = (userInfo) => {
  if (!userInfo)
    return false;
  if (!userInfo.vipCard)
    return false;
  let expTime = new Date(userInfo.vipCard.expTime).getTime();
  let nowTime = new Date().getTime();
  if (expTime <= nowTime)
    return false;
  return true;
}

/**
 * 过滤掉表情等特殊字符
 */
const filteremoji = (str) => {
  var ranges = [
    '\ud83c[\udf00-\udfff]',
    '\ud83d[\udc00-\ude4f]',
    '\ud83d[\ude80-\udeff]'
  ];
  str = str.replace(new RegExp(ranges.join('|'), 'g'), '');
  return str;
}

const expireToDay = (time) => {
  let expTime = new Date(time).getTime();
  let nowTime = new Date().getTime();
  return Math.floor((expTime - nowTime) / (1000 * 60 * 60 * 24));
}

/**
 * 生成 n 位数的随机字符串，随机字符串只为 大小写字母和数字组合
 */
const getRandomStr = (n) => {
  let str = '';
  let num = n || 10;    //确定字符串个数
  for(let i=0; i<num; i++) {
    str += strArr[Math.floor(Math.random() * 62)];
  }
  return str;
}

/**
 * 根据时间计量方式获取对应的值
 */
const getTimeUnitLabel = (timeUnit) => {
  if (timeUnit == 1) {
    return '年';
  } else if (timeUnit == 2) {
    return '个月';
  } else if (timeUnit == 3) {
    return '天';
  } else {
    return '个月';
  }
}

module.exports = {
  formatTime: formatTime,
  trim: trim,
  formatLine: formatLine,
  getAttachSrc: getAttachSrc,
  quickTip: quickTip,
  secondsToTime: secondsToTime,
  isToday: isToday,
  isYesterday: isYesterday,
  getTodayStr: getTodayStr,
  isVip: isVip,
  expireToDay: expireToDay,
  filteremoji: filteremoji,
  getRandomStr: getRandomStr,
  getTimeUnitLabel: getTimeUnitLabel
}
