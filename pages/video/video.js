var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCenterPlayBtn: false,
    selected: '1',        // 决定显示视频组件或者评论组件, '1'代表视频组件, '2'代表评论组件
    videoData: {        // 视频组件的状态数据
      video: {
        src: '',                           // 视频地址
        title: '我是陈大牛',                // 视频标题
        intro: {                           // 视频简介
          show: '这是唐代诗人王维创作的一首劝慰友人落第的诗',                        // 进入页面就显示的简介
          hide: 'helloworld'                         // 点击简介后才显示的简介内容
        },
        series: '国学/唐诗系列',                 // 系列  
        episodes: 20                          // 集数
      },
      showVideoHiddenIntro: '0',  //  控制隐藏简介的显示状态, '1'代表显示
      playing: 0,               // 正在播放的集数，控制绿色三角形的显示
      showHideEpisode: '0'      // 控制全部集数的组件的显示状态, '1'代表显示
    },
    commentData: {
      selected: '1',           // 评论的展示类型 1所有 2最新 3精华
      commentContent: ''        // 评论内容
    }
  },

  /**
   * 点击改变展示的是视频内容或评论内容
   */
  changeSelected(e) {
    this.setData({
      selected: e.target.dataset.index
    });
  },

  /**
   * 点击改变隐藏简介显示的状态
   */
  toggleHideIntro() {
    let data = 'videoData.showVideoHiddenIntro';
    this.setData({
      [data]: this.data.videoData.showVideoHiddenIntro === '0'?'1':'0' 
    });
  },

  /**
   * 点击更换播放的集数
   */
  togglePlay(e) {
    let data = 'videoData.playing';
    this.setData({
      [data]: e.currentTarget.dataset.index   
    });
  },
  /**
   * 点击改变 全部集数的组件 的显示状态
   */
  toggleHideEpisode(e) {
    let data = 'videoData.showHideEpisode';
    this.setData({
      [data]: this.data.videoData.showHideEpisode === '0' ? '1' : '0' 
    });
  },
  /**
   * 点击改变 评论 的过滤条件
   */
  toggleCommentFilter(e) {
    let data = 'commentData.selected';
    this.setData({
      [data]: e.currentTarget.dataset.index
    });
  },

  /**
   * 获取用户输入的评论内容
   */
  commentInput(e) {
    let data = 'commentData.commentContent';
    this.setData({
      [data]: e.detail.value
    });
  },

  /**
   * 提交评论，此处将换行符统一替换为逗号再提交
   */
  enterComment() {
    let data = this.data.commentData.commentContent;
    data = utils.formatLine(data);
    console.log(data);
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