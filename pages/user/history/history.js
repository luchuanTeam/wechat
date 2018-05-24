var $ = require('../../../utils/ajax.js'),
    api = require('../../../config/api.js'),
    util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    currentPressId: null,     // 记录当前要滑动的 slider
    lastPressId: null,        // 记录上一次要滑动的 slider
    // 记录要置为初始状态的 slider，比如上一次滑动的 slider 为 2，当前要滑动的 slider 为 1
    // 则 initSliderId 为 2，表示上一次滑动的 slider 必须恢复初始位置
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
    editState: 0,         // 编辑状态，值为 1 时表示客户要对历史记录进行批量操作，此时 slider不能滑动
    selectAll: 0,         // 全选状态，值为 1 时表示选择了全部的历史记录，0 表示没有全选
    selectAllText: '全选' // 全选 的文字，当 selectAll 为 1时，值为 '取消全选'， selectAll 为 0，值为 '全选'
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

  /**
   * 获取我的历史记录
   */
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

  /**
   * 将获取到的历史记录分类，根据 watchTime 分为 今天，昨天，更早 三类
   */
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
        // 每获取一条历史记录，将其记录在 selectedMap 中， key 为对应的历史记录id， value 为 'gray'
        // vale 为 'gray' 表示该历史记录没有被选中
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

  /**
   * 用户要对历史记录进行批量操作或取消批量操作的方法
   */
  toggleEdit() {
    this.setData({
      editState: this.data.editState === 0 ? 1 : 0   
    })
  },

  /**
   * 用户点击 全选 或 取消全选
   */
  toggleSelectAll() {
    let selectAll = this.data.selectAll,
        selectedMap = this.data.selectedMap;
    // 如果是全选，则要将selectedMap 所有的历史记录的值改为 'red'，表示全部选中
    // 'red' 为对应的 icon 图标颜色
    for(let key in selectedMap) {
      selectAll === 1 ? selectedMap[key] = 'gray' : selectedMap[key] = 'red'
    }
    this.setData({
      selectAll: selectAll === 1 ? 0 : 1,
      selectedMap: selectedMap,
      selectAllText: selectAll === 1 ? '全选':'取消全选'
    })
  },

  /**
   * 选择单条历史记录操作
   */
  toggleSingleSelect(e) {
    let id = e.currentTarget.dataset.id;    // 获取当前选中的历史记录的 id
    let selectedMap = this.data.selectedMap;
    selectedMap[id] = selectedMap[id] === 'gray' ? 'red' : 'gray';
    let selectAll = 1, selectAllText = '取消全选';

    // 更改一条历史记录的选中状态后，要对 selectedMap 遍历，只要有发现一条没有被选中，即可退出遍历
    // 并将全选状态 selectAll 置为 0，selectAllText 置为 '全选'
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
  * 子组件slider触发，ajax操作为 slider 子组件发送，父组件则要更改页面显示
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