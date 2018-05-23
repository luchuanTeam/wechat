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
    selectedMap: {},
    hasMore: true,
    deleteUrl: '',
    editState: 0,
    iconColor: 'gray',
    selectAll: 0,
    selectAllText: '全选'
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
        userId: userId,
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize
      }
    }).then((res) => {
      if (res.data.status === 200) {
        let result = res.data.data,
            list = result.list,
            total = result.total;
        this.groupHistoryList(list, total);
      } else {
        util.quickTip('获取历史记录失败, 请稍后再试');
      }
    }).catch((err) => {
      console.log(err);
      util.quickTip('获取历史记录失败, 请稍后再试!');
    });
  },

  groupHistoryList(list, total) {
    let historyList = this.data.historyList,
        selectedMap = this.data.selectedMap,
        pageNum = this.data.pageNum,
        hasMore = true;
    for (let i = 0, length = list.length; i < length; i++) {
      if(list[i].episodeInfo) {
        // 增加 id 属性，传入slider组件，以便删除，因为 slider 组件也会被历史记录复用
        list[i].id = list[i].historyId;
        list[i].episodeInfo.imgSrc = 'https://www.yanda123.com/yanda/attach/readFile?size=200&id=' + list[i].episodeInfo.imgAppendixId;
        list[i].progress = util.secondsToTime(parseInt(list[i].progress / 1000));
        list[i].duration = util.secondsToTime(parseInt(list[i].episodeInfo.duration / 1000));
        selectedMap[list[i].historyId] = 'gray';
        if (util.isToday(list[i].watchTime)) {
          list[i].watchTime = `今天 ${list[i].watchTime.slice(11, 16)}`;
          historyList.today.push(list[i]);
        } else if (util.isYesterday(list[i].watchTime)) {
          list[i].watchTime = `昨天 ${list[i].watchTime.slice(11, 16)}`;
          historyList.yesterday.push(list[i]);
        } else {
          list[i].watchTime = list[i].watchTime.slice(0, 16);
          historyList.past.push(list[i]);
        }
      }
    }
    (historyList.today.length + historyList.yesterday.length + historyList.past.length) < total ? (pageNum++) : (hasMore = false);
    this.setData({
      historyList: historyList,
      selectedMap: selectedMap,
      pageNum: pageNum,
      hasMore: hasMore
    })
  },

  toggleEdit() {
    this.setData({
      editState: this.data.editState === 0 ? 1 : 0   
    })
  },

  toggleSelectAll() {
    let selectAll = this.data.selectAll,
        selectedMap = this.data.selectedMap;
    for(let key in selectedMap) {
      selectAll === 1 ? selectedMap[key] = 'gray' : selectedMap[key] = 'red'
    }
    this.setData({
      selectAll: selectAll === 1 ? 0 : 1,
      selectedMap: selectedMap,
      selectAllText: selectAll === 1 ? '全选':'取消全选'
    })
  },

  toggleSingleSelect(e) {
    let id = e.currentTarget.dataset.id;
    let selectedMap = this.data.selectedMap;
    selectedMap[id] = selectedMap[id] === 'gray' ? 'red' : 'gray';
    let selectAll = 1, selectAllText = '取消全选'
    for(let key in selectedMap) {
      if(selectedMap[key] === 'gray') {
        selectAll = 0;
        selectAllText = '全选';
        break;
      }
    }
    this.setData({
      selectAll: selectAll,
      selectAllText: selectAllText,
      selectedMap: selectedMap
    });
  },

  /**
  * 子组件slider触发，根据 id 删除页面的内容
  */
  deleteById(e) {
    let id = e.detail.id;
    let selectedMap = this.data.selectedMap;
    delete selectedMap[id];
    this.setData({
      selectedMap: selectedMap  
    });
  },

  /**
   * 批量删除，父组件触发
   */
  deleteHistories() {
    let selectedMap = this.data.selectedMap,
        ids = [];
    for (let key in selectedMap) {
      if(selectedMap[key] === 'red') {
        ids.push(key);
        delete selectedMap[key];
      }
    }
    if (ids.length > 0) {
      $.post({
        url: api.HistoryDeleteByIds,
        data: {
          ids: ids
        }
      }).then((res)=> {
        if(res.data.status === 200) {
          this.setData({
            selectedMap: selectedMap  
          })  
        } else {
          util.quickTip('网络错误，请稍后再试');
        }
      }).catch((err)=> {
        util.quickTip('网络错误，请稍后再试');
      });
    }
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
    if(this.data.userId && this.data.hasMore) {
      this.getMyHistories(this.data.userId);
    }  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})