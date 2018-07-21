var utils = require('../../../../utils/util.js');
var $ = require('../../../../utils/ajax.js');
var api = require('../../../../config/api.js');
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

  usernameValid(username) {
    if (!/[0-9]{14}$/.test(username)) {
      return false;
    } else {
      return true;
    }
  },

  submit: function() {
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
    let userId = this.data.userInfo.userId;
    $.post({
      url: api.VipBind,
      data: { cardNum: userName, cardPassword: password, userId: userId}
    }).then((res) => {
      let data = res.data;
      if (data.status == 200) {

        let userInfo = res.data.data;
        wx.setStorageSync('userInfo', userInfo);

        wx.showToast({
          title: '绑定会员卡成功',
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
        wx.showToast({
          title: data.message,
          icon: 'none',
          duration: 3000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })
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