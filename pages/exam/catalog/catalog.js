var api = require('../../../config/api.js');

const CATALOGS = [{
    id: 1,
    label: '专题练习',
    icon: 'https://www.yanda123.com/app/ztlx.png',
    url: '../chapter/chapter',
    type: api.ClsTypeEnum.ZTLXZ,
    module: 1
  },
  {
    id: 2,
    label: '知识巩固',
    icon: 'https://www.yanda123.com/app/zsgg.png',
    url: '../chapter/chapter',
    type: api.ClsTypeEnum.ZSGGZ,
    module: 2
  },
  {
    id: 3,
    label: '历年真题',
    icon: 'https://www.yanda123.com/app/lnzt.png',
    url: '../unit/unit',
    type: api.ClsTypeEnum.LNZT,
    module: 3
  },
  {
    id: 4,
    label: '仿真练习',
    icon: 'https://www.yanda123.com/app/fzlx.png',
    url: '../unit/unit',
    type: api.ClsTypeEnum.FZLX,
    module: 4
  }
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    catalogs: CATALOGS,
    parentId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let title = options.title;
    let parentId = options.id;
    this.setData({
      title: title,
      parentId: parentId
    });
    wx.setNavigationBarTitle({
      title: title
    });
  },

  toNextPage(e) {
    let url = e.currentTarget.dataset.url;
    let type = e.currentTarget.dataset.type;
    let module = e.currentTarget.dataset.module;
    let parentId = this.data.parentId;
    let title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: `${url}?title=${title}&type=${type}&module=${module}&id=${parentId}`
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})