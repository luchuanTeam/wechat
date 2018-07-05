var util = require('./util.js');

const request = (obj, method)=> {
  if (typeof obj === 'object') {
    let url = obj.url;      // url: 请求地址
    if (url && typeof url === 'string') {
      let data = obj.data || {},    // data: 请求参数
          header = obj.header;
      !method && (method = obj.method || 'GET');
      method = method.toUpperCase();
      if (!header || typeof header !== 'object' || JSON.stringify(header) === '{}') {
        if(method === 'POST') {
          header = { "Content-Type": "application/x-www-form-urlencoded" };
        } else {
          header = { "Content-Type": "application/json" };
        }
        header.terminal = 'wechat';
        header.token = wx.getStorageSync('token');
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
  }
}

module.exports = _ajax;