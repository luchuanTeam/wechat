var $ = require('../../../utils/ajax.js'),
    api = require('../../../config/api.js'),
    util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    deleteUrl: '',     // 传入slider组件，告知删除请求发送的url
    currentPressId: null,
    lastPressId: null,
    initSliderId: null,
    pageNum: 1,
    pageSize: 10,
    collectList: {
      videoList: [],    // 视频收藏
      musicList: []     // 音频收藏
    },
    hasMore: true
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
    let userInfo = wx.getStorageSync('userInfo');
    if(userInfo && userInfo.userId) {
      this.setData({
        userId: userInfo.userId,
        deleteUrl: api.CollectDelete
      });
      this.getMyCollects(this.data.userId);
    }
  },

  getMyCollects(userId) {
    $.get({
      url: api.CollectIndex,
      data: {
        userId: userId,
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize
      }
    }).then((res) => {
      if (res.data.status === 200) {
        let result = res.data.data,
          list = result.list,
          total = result.total;
        console.log(JSON.stringify(result));
        this.groupCollectList(list, total);
      } else {
        util.quickTip('获取我的收藏失败, 请稍后再试');
      }
    }).catch((err) => {
      console.log(err);
      util.quickTip('获取我的收藏失败, 请稍后再试');
    })
  },

  groupCollectList(list, total) {
    let collectList = this.data.collectList, 
        pageNum = this.data.pageNum,
        hasMore = true;
    for(let i = 0, length = list.length; i < length; i++) {
       // 增加 id 属性，传入slider组件，以便删除，因为 slider 组件也会被历史记录复用
      list[i].id = list[i].collectId;  
      if (list[i].episodeInfo) {
        list[i].episodeInfo.imgSrc = 'https://www.yanda123.com/yanda/attach/readFile?size=800&id=' + list[i].episodeInfo.imgAppendixId;
        if (list[i].episodeInfo.type === 1) {
          collectList.videoList.push(list[i]);
        } else if (list[i].episodeInfo.type === 2) {
          collectList.musicList.push(list[i]);
        }
      }
      
    }
    (collectList.videoList.length + collectList.musicList.length) < total ? (pageNum++) : (hasMore = false);
    this.setData({
      collectList: collectList,
      pageNum: pageNum,
      hasMore: hasMore
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
    if(this.data.userId) {
      this.getMyCollects(this.data.userId);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})