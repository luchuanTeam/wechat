var $ = require('../../../utils/ajax.js'),
    api = require('../../../config/api.js'),
    util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    currentPressId: null,
    lastPressId: null,
    initSliderId: null,
    pageNum: 1,
    pageSize: 10,
    historyList: {
      today: [],
      yesterday: [],
      past: []
    },
    hasMore: true,
    deleteUrl: ''
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
    if (_lastPressId && _currentPressId !== _lastPressId) {
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
    if (userInfo && userInfo.userId) {
      this.setData({
        userId: userInfo.userId,
        deleteUrl: api.HistoryDelete
      });
      this.getMyHistories(this.data.userId);
    }  
  },

  getMyHistories(userId) {
    $.get({
      url: api.HistoryIndex,
      data: {
        userId: userId
      }
    }).then((res) => {
      if (res.data.status === 200) {
        let result = res.data.data,
          list = result.list,
          total = result.total;
        console.log(JSON.stringify(result));  
        this.groupHistoryList(list, total);
      } else {
        util.quickTip('获取历史记录失败, 请稍后再试');
      }
    }).catch((err) => {
      util.quickTip('获取历史记录失败, 请稍后再试');
    });
  },

  groupHistoryList(list, total) {
    let historyList = this.data.historyList,
      pageNum = this.data.pageNum,
      hasMore = true;
    for (let i = 0, length = list.length; i < length; i++) {
      // 增加 id 属性，传入slider组件，以便删除，因为 slider 组件也会被历史记录复用
      list[i].id = list[i].historyId;
      list[i].episodeInfo.imgSrc = 'https://www.yanda123.com/yanda/attach/readFile?size=200&id=' + list[i].episodeInfo.imgAppendixId;
      list[i].progress = util.secondsToTime(parseInt(list[i].progress/1000));
      list[i].duration = util.secondsToTime(parseInt(list[i].episodeInfo.duration/1000));
      if(util.isToday( list[i].watchTime) ) {
        list[i].watchTime = `今天 ${list[i].watchTime.slice(11, 16)}`;
        historyList.today.push(list[i]);
      } else if(util.isYesterday( list[i].watchTime )) {
        list[i].watchTime = `昨天 ${list[i].watchTime.slice(11, 16)}`;
        historyList.yesterday.push(list[i]);
      } else {
        list[i].watchTime = list[i].watchTime.slice(0, 16);
        historyList.past.push(list[i]);  
      }
    }
    (historyList.today.length + historyList.yesterday.length + historyList.past.length) < total ? (pageNum++) : (hasMore = false);
    this.setData({
      historyList: historyList,
      pageNum: pageNum,
      hasMore: hasMore
    })
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