var util = require('./util.js');
const request = (obj, method)=> {
  if (typeof obj === 'object') {
    let url = obj.url;      // url: 请求地址
    if (url && typeof url === 'string') {
      let data = obj.data || '',    // data: 请求参数
          header = obj.header;
      !method && (method = obj.method || 'GET');
      method = method.toUpperCase();
      if (!header || typeof header !== 'object' || JSON.stringify(header) === '{}') {
        if(method === 'POST') {
          header = { "Content-Type": "application/x-www-form-urlencoded" };
        } else {
          header = { "Content-Type": "application/json" };
        }
      }
      let dataType = obj.dataType || 'json';
      let promise = new Promise((resolve, reject) => {
        wx.request({
          url: url,
          data: data,
          header: header,
          method: method,
          dataType: dataType,
          success: (res) => {
            resolve(res);
          },
          fail: (err) => {
            reject(err);
          }
        })
      });
      return promise;
    } else {
      console.log('url必须为字符串')
    }
  } else {
    console.log('传参类型必须为object类型')
  }
};

const pay = (obj) => {
  if(typeof obj === 'object') {
    let timeStamp = obj.timeSamp || String(~~(new Date().getTime()/1000));
    let noncStr = obj.noncStr || util.getRandomStr();
    let signType = 'MD5';
    let _package = obj.package || '';
    let paySign = obj.paySign || '';
    // if(!_package || paySign) {
    //   console.log('传参不足，不能调用微信支付');
    //   return;
    // }
    let promise = new Promise((resolve, reject) => {
      wx.requestPayment({
        timeStamp: timeStamp,
        nonceStr: noncStr,
        package: _package,
        signType: signType,
        paySign: paySign,
        success: (res) => {
          console.log('???' + JAON.stringify(res));
          resolve(res);
        },
        fail: (err) => {
          console.log('!!!' + JAON.stringify(err));
          reject(err);
        }
      });
      return promise;
    })

  } else {
    console.log('传参类型必须为object类型');  
  }
}


const _ajax = {  
  get: function(obj) {
    return request(obj, 'GET');
  },
  post: function(obj) {
    return request(obj, 'POST');
  },
  put: function(obj) {
    return request(obj, 'PUT');
  },
  delete: function(obj) {
    return request(obj, 'DELETE');
  },
  ajax: function(obj) {   //使用其他请求需在 obj 里面定义 method 请求方式
    return request(obj, obj.method);
  },
  pay: function(obj) {
    return pay(obj);
  }
}

module.exports = _ajax;