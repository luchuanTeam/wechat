var utils = require('../../../utils/util.js');
var $ = require('../../../utils/ajax.js');
var api = require('../../../config/api.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userName: '',
    password: ''
  },

  /**
   * 账号输入
   */
  usernameChange: function (e) {

    this.setData({
      userName: e.detail.value
    });
  },

  /**
   * 密码输入
   */
  passwordChange: function (e) {

    this.setData({
      password: e.detail.value
    });
  },

  /**
   * 手机号校验
   */
  usernameValid(username) {
    if (!/[0-9]{14}$/.test(username)) {
      return false;
    } else {
      return true;
    }
  },

  /**
   * 会员登录
   */
  login: function() {
    let userName = this.data.userName;
    if (!userName) {
      utils.quickTip('请输入会员账号');
      return;
    }
    if (!this.usernameValid(userName)) {
      utils.quickTip('请输入14位数字的会员卡号');
      return;
    }
    let password = this.data.password;
    if (!password) {
      utils.quickTip('请输入密码');
      return;
    }

    $.post({
      url: api.UserLogin,
      data: { userName: userName, password: password }
    }).then((res) => {
      let data = res.data;
      if (data.status == 200) {
        let userInfo = data.data.userInfo;
        app.globalData.userInfo = userInfo;
        wx.setStorageSync('userInfo', userInfo);
        wx.setStorageSync('token', data.data.token);
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          success: function () {
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/user/user',
              });
            }, 1000);
          }
        });
      } else {
        utils.quickTip(data.message);
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = app.globalData.userInfo;
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