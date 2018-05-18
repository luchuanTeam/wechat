var utils = require('../../../utils/util.js');
var $ = require('../../../utils/ajax.js');
var api = require('../../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    mobile: '',
    code: '',
    sendDisabled: false,
    forbiddenTime: 0,
    codeText: '获取验证码'
  },

  /**
   * 手机号输入
   */
  mobileChange: function (e) {

    this.setData({
      mobile: e.detail.value
    });
  },

  /**
   * 验证码输入
   */
  codeChange: function (e) {

    this.setData({
      code: e.detail.value
    });
  },

  /**
   * 发送验证码
   */
  sendCode: function () {
      let mobile = this.data.mobile;
      if (!mobile) {
        utils.quickTip('请输入手机号');
        return;
      }
      if (!this.mobileValid(mobile)) {
        utils.quickTip('请输入正确的手机号');
        return;
      }
      let userId = this.data.userInfo.userId;
      $.post({
        url: api.UserSendCode,
        data: {userId: userId, mobile: mobile}
      }).then((res) => {
        let data = res.data;
        if (data.status == 200) {
          this.setData({
            sendDisabled: true
          });
          this.reflashTime(120);
        } else {
          utils.quickTip(data.message);
        }
      })
  },
  /**
   * 绑定手机号
   */
  bindMobile: function () {
    let mobile = this.data.mobile;
    if (!mobile) {
      utils.quickTip('请输入手机号');
      return;
    }
    let code = this.data.code;
    if (!mobile) {
      utils.quickTip('请输入验证码');
      return;
    }
    let userId = this.data.userInfo.userId;
    $.post({
      url: api.UserBindMobile,
      data: { userId: userId, mobile: mobile, code: code }
    }).then((res) => {
      let data = res.data;
      if (data.status == 200) {
        let userInfo = this.data.userInfo;
        userInfo.mobile = mobile;
        wx.setStorageSync('userInfo', userInfo);
        this.setData({
          sendDisabled: false
        });
        wx.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 10000,
          success: function() {
            wx.switchTab({
              url: '/pages/user/home/home',
            });
          }
        })
      } else {
        utils.quickTip(data.message);
      }
    })
  },
  /**
   * 刷新验证码重新获取时间
   */
  reflashTime(time) {
    let that = this;
    let index = setInterval(function() {
      time -= 1;
      if (time <= 0) {
        that.setData({
          forbiddenTime: 0,
          sendDisabled: false,
          codeText: '获取验证码'
        });
        index = null;
      } else {
        that.setData({
          forbiddenTime: time,
          codeText: '重新获取' + time +'s'
        });
      }
    }, 1000);
  },
  /**
   * 手机号校验
   */
  mobileValid(mobile) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(mobile)) {
      return false;
    } else {
      return true;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})