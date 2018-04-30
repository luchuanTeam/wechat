const util = require('../../utils/util.js'),
      $ = require('../../utils/ajax.js');
Page({
  data: {
    userInfo: {},
    hasLogin: false
  },
  onLoad: function () {
    let userInfo = wx.getStorageSync('userInfo');
    console.log(JSON.stringify(userInfo));
    if(!userInfo) {
      let sessionId = wx.getStorageInfoSync('sessionId'),
          token = wx.getStorageInfoSync('token');
      if(sessionId && token) {
        $.post({
          url: 'https://www.yanda123.com/yanda/user/checkToken',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          data: {
            sessionId: sessionId,
            token: token
          }  
        }).then((res)=> {
          let result = res.data;
          if(result.status === 200) {
            wx.setStorageSync('userInfo', result.data);
            this.setData({
              hasLogin: true,
              userInfo: result.data
            });
          }   
        }).catch((err)=> {
          console.log(err);
        });
      }    
    } else {
      this.setData({
        hasLogin: true,
        userInfo: userInfo
      })
    }
  },
  toOtherPage(e) {
    let pageName = e.currentTarget.dataset.page + '/' + e.currentTarget.dataset.page;
    wx.navigateTo({
      url: '../settingFolder/' + pageName ,
    });
  },
  formSubmit(e) {
    let userName = util.trim(e.detail.value.username);
    let password = util.trim(e.detail.value.password);
    if(!userName) {
      util.quickTip('请输入账号');
    } else {
      $.post({
        url: 'https://www.yanda123.com/yanda/user/login',
        header: {"Content-Type": "application/x-www-form-urlencoded"},
        data: {
          userName: userName,
          password: password
        }
      }).then((res)=> {
        console.log('result: ' + JSON.stringify(res));
        let result = res.data;
        if(result.status === -1) {
          util.quickTip(result.message);
        } else if(result.status === 200){
          wx.setStorageSync('userInfo', result.data.userInfo);
          wx.setStorageSync('sessionId', result.data.sessionId);
          wx.setStorageSync('token', result.data.token);
          this.setData({
            hasLogin: true,
            userInfo: result.data.userInfo
          });
        } else {
          util.quickTip('网络错误，请稍后再试'); 
        }
      }).catch((err)=>{
        console.log(err);
      })
    }
  },
  logout(e) {
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('sessionId');
    wx.removeStorageSync('token');
    this.setData({
      hasLogin: false,
      userInfo: {}
    });
  }
})