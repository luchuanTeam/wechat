const CATALOGS = [
  { id: 1, label: '章节练习', icon: 'https://www.yanda123.com/app/zjlx.png', url: '../chapter/chapter' },
  { id: 2, label: '单元测试', icon: 'https://www.yanda123.com/app/dycs.png', url: '../unit/unit' },
  { id: 3, label: '期中期末', icon: 'https://www.yanda123.com/app/qzqm.png', url: '../unit/unit' },
  { id: 4, label: '专业知识练习', icon: 'https://www.yanda123.com/app/zyzslx.png', url: '../chapter/chapter' }
  // { id: 5, label: '错题集', icon: 'https://www.yanda123.com/app/time.png', url: '' },
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    catalogs: CATALOGS
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = options.title;
    this.setData({
      title: title
    });
    wx.setNavigationBarTitle({
      title: title
    });
  },

  toNextPage(e) {
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: `${url}?title=${this.data.title}`
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