var utils = require('../../../utils/util.js');
var $ = require('../../../utils/ajax.js');
var api = require('../../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    records: [],
    pageNum: 1,
    pageSize: 10,
    canLoadMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({
      userInfo: userInfo
    });
    this.getBills();
  },

  getBills() {
    let userId = this.data.userInfo.userId; 
    if(userId) {
      $.get({
        url: api.GetPayRecords,
        data: {
          userId: userId,
          pageNum: this.data.pageNum,
          pageSize: this.data.pageSize
        }
      }).then((res)=> {
        console.log(JSON.stringify(res));
        let result = res.data.data;
        if(result.total > result.pageNum * result.pageSize) {
          this.setData({
            canLoadMore: true,
            pageNum: result.pageNum+1
          })
        }
        this.setData({
          records: result.list
        })
      }).catch((err)=> {
        console.log(JSON.stringify(err));
      })
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
    if(this.data.canLoadeMore) {
      this.getBills();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})