const $ = require('../../utils/ajax.js');
const STYLE_ARR = ['baby-blue', 'pink', 'olive-green', 'orange', 'light-cyan'];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topCategory: [],      // 一级目录
    selected: '',                    // 被选择的一级目录
    styleArr: STYLE_ARR,            // 二级目录样式数组
    secondCategory: [],        // 选择一级目录对应的二级目录内容
    categoryCache: {}         // 保存已加载的二级目录数据
  },
  /**
   * 二级分类数据加载
   */
  loadSecondCategory: function(id) {
    $.get({ url: "http://www.yanda123.com/yanda/movie/getClassify/" + id})
     .then((res)=> {
       if (res.statusCode == 200) {
         let data = res.data;
         let key = 'categoryCache[' + id + ']';
         this.setData({
           selected: id,
           secondCategory: data,
           [key]: data
         });
       }
     }).catch((err)=>{
       console.log(err);
     });
  },

  /**
   * 点击一级目录更改显示
   */
  changeSelected(e) {
    let id = e.target.dataset.id;
    if (this.data.categoryCache[id]) {
      this.setData({
        selected: id,
        secondCategory: this.data.categoryCache[id]
      });
    } else {
      this.loadSecondCategory(id);
    }
  },

  /**
   * 跳转到视频列表页面
   */
  toVideoList(e) {
    wx.navigateTo({
      url: '../videoList/videoList',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取从页面传递过来的分类id
    let id = options.id || '1';
    this.setData({
      selected: id
    });

    $.get({ url: 'http://www.yanda123.com/yanda/movie/getClassify'})
     .then((res)=> {
       if (res.statusCode == 200) {
         let data = res.data;
         this.setData({
           topCategory: data
         });
         this.loadSecondCategory(id);
       } 
     }).catch((err)=> {
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
  onShow: function (options) {

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