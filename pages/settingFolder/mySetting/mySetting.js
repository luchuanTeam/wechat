const utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountAndSafe: '账户与安全',
    checkAndUpdate: '检查更新',
    aboutUs: '关于我们',
    cache: '0'
  },

  toAccountPage() {
    wx.navigateTo({
      url: '../account/account',
    });
  },

  toAboutUsPage() {
    wx.navigateTo({
      url: '../aboutUs/aboutUs',
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cache = this.getCache();
    this.setData({
      cache: cache
    });
  },

  getCache() {
    let cache;
    try {
      let res = wx.getStorageInfoSync();
      cache = res.currentSize;
      if (cache > 1024) {
        cache = (cache / 1024).toFixed(2) + 'MB';
      } else {
        cache = cache + 'KB';
      }
    } catch (e) {
      cache = '2KB';
    }
    return cache;
  },

  clearCache() {
    let userInfo = wx.getStorageSync('userInfo');
    try {
      wx.clearStorageSync();
      wx.setStorageSync('userInfo', userInfo);
      let cache = this.getCache();
      utils.quickTip('清除缓存成功');
    } catch (e) {
      wx.setStorageSync('userInfo', userInfo);
      utils.quickTip('清除缓存失败，请稍后再试')
    }
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