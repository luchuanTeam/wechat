var $ = require('../../../utils/ajax.js');
var api = require('../../../config/api.js');
let filter = require('../../../utils/filter.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    module: '',
    classifies: []
  },

  toTest(e) {
    let id = e.currentTarget.dataset.id;
    let module = this.data.module;
    wx.navigateTo({
      url: `../test/test?id=${id}&module=${module}`
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = options.title;
    let id = options.id;
    let type = options.type;
    let module = options.module;
    this.setData({
      title: title,
      module: module
    });

    wx.setNavigationBarTitle({
      title: title
    });

    $.get({ url: api.ClassifyTreeList, data: { type: type, parentId: id } })
      .then((res) => {
        if (res.statusCode == 200) {
          let data = res.data;
          this.setData({
            classifies: data
          });
        }
      }).catch((err) => {
        console.log(err);
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