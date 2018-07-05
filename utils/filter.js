let $ = require('./ajax.js');
var api = require('../config/api.js');

function identityFilter(pageObj) {
  if (pageObj.onShow) {
    let _onShow = pageObj.onShow;
    pageObj.onShow = function () {

      $.post({
        url: api.UserCheckToken
      }).then((res) => {
        if (res.data.status !== 200) {
          wx.showModal({
            title: '友情提示',
            content: res.data.message,
            showCancel: false,
            success: function () {
              setTimeout(function () {
                wx.clearStorageSync();
                wx.switchTab({
                  url: '/pages/user/user',
                });
              }, 1000);
            }
          });
        } else {
          //获取页面实例，防止this劫持
          let currentInstance = getPageInstance();
          _onShow.call(currentInstance)
        }
      }).catch((err) => {
        console.log(err);
      })  
    }
  }
  return pageObj;
}

function getPageInstance() {
  var pages = getCurrentPages();
  return pages[pages.length - 1];
}

exports.identityFilter = identityFilter;