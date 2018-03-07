

const ajax = {  
  request: function(obj, method){
    if (typeof obj === 'object') {
      let url = obj.url;      // url: 请求地址
      if (url && typeof url === 'string') {
        let data = obj.data || '',    // data: 请求参数
          header = obj.header;
        if (typeof header !== 'object' || JSON.stringify(header) === '{}') {
          header = { "Content-Type": "application/json" };
        }
        !method && (method = 'GET');
        let promise = new Promise((resolve, reject) => {
          wx.request({
            url: url,
            data: data,
            header: header,
            method: method,
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
  },
  get: function(obj) {
    return this.request(obj, 'GET');
  },
  post: function(obj) {
    return this.request(obj, 'POST');
  }
}

module.exports = ajax;