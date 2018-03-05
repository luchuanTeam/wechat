
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCenterPlayBtn: false,
    selected: '1',
    video: {
      src: '',                           // 视频地址
      title: '我是陈大牛',                // 视频标题
      intro: {                           // 视频简介
        show: '这是唐代诗人王维创作的一首劝慰友人落第的诗',                        // 进入页面就显示的简介
        hide: 'helloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworldhelloworld'                         // 点击简介后才显示的简介内容
      },
      series: '国学/唐诗系列',                 // 系列  
      episodes: 20
    },
    showVideoHiddenIntro: '0',
    playing: 0
  },

  /**
   * 点击改变展示的是视频内容或评论内容
   */
  changeSelected(e) {
    this.setData({
      selected: e.target.dataset.index
    });
  },

  toggleHideIntro() {
    this.setData({
      showVideoHiddenIntro: this.data.showVideoHiddenIntro === '0'?'1':'0' 
    })
  },

  /**
   * 点击更换播放的集数
   */
  togglePlay(e) {
    this.setData({
      playing: e.currentTarget.dataset.index   
    })
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