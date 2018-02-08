
const REGISTER = 0,
      LOGIN = 1,
      SCAN = 2,
      VIP = 3,
      RECOMMEND = 4;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: REGISTER,
    title: "主页"
  },

  activeTabChange(e) {
    this.setData({
      activeTab: e.detail.index,
      title: "主页君，你好"
    });
    console.log(this.data.activeTab);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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