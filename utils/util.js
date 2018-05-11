const domain = 'https://www.yanda123.com';

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
 */
const quickTip = (str, icon, time)=> {
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

module.exports = {
  formatTime: formatTime,
  trim: trim,
  formatLine: formatLine,
  getAttachSrc: getAttachSrc,
  quickTip: quickTip,
  secondsToTime: secondsToTime
}
