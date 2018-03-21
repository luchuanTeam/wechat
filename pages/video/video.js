const utils = require('../../utils/util.js');
const $ = require('../../utils/ajax.js');
const REFRESH = '1';

var _pageNum = 'commentData.pageNum',
    _canLoadMore = 'commentData.canLoadMore',
    _commentList = 'commentData.commentList';    

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvId: '',            //从页面传过来的视频ID参数
    showCenterPlayBtn: false,
    selected: '1',        // 决定显示视频组件或者评论组件, '1'代表视频组件, '2'代表评论组件
    videoData: {        // 视频组件的状态数据
      video: {
        src: '',                           // 视频地址
        episodeName: '我是陈大牛',                  // 视频标题
        episodeIntro: '这是唐代诗人王维创作的一首劝慰友人落第的诗',
        series: '国学/唐诗系列',                 // 系列  
        episodeCount: 20,                       // 集数
        episodeId: '1',                          // 视频id
        episodeNum: 0                           // 当前正在播放的集数          
      },
      showVideoHiddenIntro: '0',  //  控制隐藏简介的显示状态, '1'代表显示
      playing: 0,               // 正在播放的集数，控制绿色三角形的显示
      showHideEpisode: '0'      // 控制全部集数的组件的显示状态, '1'代表显示
    },
    commentData: {
      pageNum: 1,
      pageSize: 3,          
      criteria: '1',            // 评论的展示类型 1最新 2所有 3精华
      commentList: [],          // 评论列表数
      modelInput: '0',           // 评论模态框的展示, 0 隐藏, 1 显示
      canLoadMore: '1',
      textArea: ''
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
    let data = 'videoData.video.episodeNum';
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
    let data = 'commentData.criteria';
    this.setData({
      [data]: e.currentTarget.dataset.index
    });
    this.loadComments(REFRESH);
  },

  toggleModelInput() {
    let data = 'commentData.modelInput';
    this.setData({
      [data]: this.data.commentData.modelInput === '0'? '1':'0'
    });
    this.data.commentData.modelInput === '1' && (this.videoContext.pause());  //弹出评论模态框后暂停视频播放
  },

  /**
   * 获取用户输入的评论内容
   */
  enterComment(e) {
    let data = 'commentData.commentContent';
    this.setData({
      [data]: e.detail.value
    });
  },

  /**
   * 提交评论，此处将换行符统一替换为逗号再提交
   */
  commitComment() {
    let data = this.data.commentData.commentContent;
    data = utils.formatLine(data);
    data = utils.trim(data);
    if(data !== ''){
      let commentInfo = {
        commentContent: data,     // 评论内容
        userId: 1,               // 用户id
        episodeId: this.data.videoData.video.episodeId      // 视频id
      }  
      $.post({
        url: 'https://www.yanda123.com/yanda/comment/saveComment',
        data: commentInfo
      }).then((res)=> {
        if(res.data.status === 200) {
          this.toggleModelInput();
          this.loadComments(REFRESH); 
        }
      }).catch((err)=> {
        console.log(err);
      });
    } else {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none',
        mask: true,
        complete: () => {
          setTimeout(function () {
            wx.hideToast();
          }, 1000)
        }
      });
    }
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化从页面传递过来的视频id
    this.setData({
      mvId: options.id || 1
    });
    this.loadComments(REFRESH); 
  },

  /**
   * 加载评论数据
   * @param refresh: 代表是否刷新评论 '1' 代表刷新，其他代表加载更多
   */
  loadComments(refresh) {
    if(this.data.commentData.canLoadMore === '1' || refresh === '1') {
      let pageSize = this.data.commentData.pageSize,
          pageNum = this.data.commentData.pageNum;
      $.get({
        url: 'https://www.yanda123.com/yanda/comment/list',
        data: { 
          pageNum: pageNum,
          pageSize: pageSize,
          episodeId: this.data.videoData.video.episodeId,
          criteria: this.data.commentData.criteria
        }
      }).then((res) => {
        let list = res.data.data.list;
        this.groupCommentList({
          list: list,
          pageNum: pageNum,
          refresh: refresh
        });
      }).catch((err) => {
        console.log(err);
      });
    }  
  },

  /**
   * 整合commentList 数据
   */
  groupCommentList(data) {
    let commentList = this.data.commentData.commentList,
        canLoadMore = '1',
        list = data.list,
        pageNum = data.pageNum,
        refresh = data.refresh;   
    
    list.length >= 3 ? pageNum++ : canLoadMore = '0';
    for(let i=0; i<list.length; i++) {
      list[i].userName = '樱木花道',
      list[i].avatar = '../../../resources/images/fenlei.png',
      commentList.push(list[i]);
    }
    this.setData({
      [_commentList]: commentList,
      [_pageNum]: pageNum,
      [_canLoadMore]: canLoadMore
    });
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo');   // 获取控制视频的对象，操作组件内 <video/> 组件
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
    console.log('unload????');
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