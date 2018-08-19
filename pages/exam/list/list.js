var $ = require('../../../utils/ajax.js');
var api = require('../../../config/api.js');
let filter = require('../../../utils/filter.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    examList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $.get({ url: api.ClassifyList, data: { type: api.ClsTypeEnum.KAOTI } })
      .then((res) => {
        if (res.statusCode == 200) {
          let data = res.data;
          this.setData({
            examList: data
          });
        }
      }).catch((err) => {
        console.log(err);
      });
  },

  toCatalog(e) {
    let title = e.currentTarget.dataset.desc;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../catalog/catalog?title=${title}&id=${id}`
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