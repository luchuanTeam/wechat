
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slides: [1,2,3],
    currentPressId: null,
    lastPressId: null,
    initSliderId: null
  },

  /**
   * 触摸开始，子组件触发，记录下当前所要滑动的滑块
   */
  pressStart(e) {
    this.setData({
      currentPressId: e.detail.sliderId
    })
  },

  /**
   * 滑动结束，子组件触发，判断滑动结束后，当前要左滑的滑块是否和上次左滑的滑块一样，
   * 如果不一样，则要将上次左滑的滑块恢复起始状态
   */
  pressEnd(e) {
    let _lastPressId = this.data.lastPressId,
        _currentPressId = this.data.currentPressId;
    if(_lastPressId && _currentPressId !== _lastPressId) {
      this.setData({
        initSliderId: _lastPressId,
        lastPressId: -1
      })
    } 
  },

  /**
   * 已经发生了左滑，则要记录当前发生左滑的滑块，为下次滑动准备
   */
  slideLeft(e) {
    let sliderId = e.detail.sliderId;
    this.setData({
      lastPressId: sliderId  
    });
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