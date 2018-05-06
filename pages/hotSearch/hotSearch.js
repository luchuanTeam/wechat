var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var $ = require('../../utils/ajax.js');

var app = getApp()
Page({
  data: {
    keywrod: '',
    searchStatus: false,
    mvList: [],
    helpKeyword: [],
    historyKeyword: [],
    categoryFilter: false,
    currentSortType: 'default',
    currentSortOrder: 'desc',
    filterCategory: [],
    defaultKeyword: {},
    hotKeyword: [],
    page: 1,
    size: 20,
    categoryId: 0,
    userId: null
  },
  //事件处理函数
  closeSearch: function () {
    wx.navigateBack()
  },
  clearKeyword: function () {
    this.setData({
      keyword: '',
      searchStatus: false
    });
  },
  onLoad: function () {
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userId: userInfo.userId
      });
    }
    this.getSearchKeyword();
  },

  getSearchKeyword() {
    let that = this;
    $.get({
      url: api.SearchIndex,
      data: { userId: this.data.userId }
    }).then(function (res) {
      let data = res.data;
      if (data.status === 200) {
        that.setData({
          historyKeyword: data.data.historyKeywordList,
          defaultKeyword: data.data.defaultKeyword,
          hotKeyword: data.data.hotKeywordList
        });
      }
    });
  },

  inputChange: function (e) {

    this.setData({
      keyword: e.detail.value,
      searchStatus: false
    });
    this.getHelpKeyword();
  },
  getHelpKeyword: function () {
    let that = this;

    $.get({
      url: api.SearchHelper,
      data: { keyword: that.data.keyword }
    }).then(function (res) {
      let data = res.data;
      if (data.status === 200) {
        that.setData({
          helpKeyword: data.data
        });
      }
    });
  },
  inputFocus: function () {
    this.setData({
      searchStatus: false,
      mvList: []
    });

    if (this.data.keyword) {
      this.getHelpKeyword();
    }
  },
  clearHistory: function () {
    this.setData({
      historyKeyword: []
    })

    $.post({
      url: api.SearchClearHistory,
      data: { userId: this.data.userId }
    }).then(function (res) {
      console.log('清除成功');
    });
  },
  getmvList: function () {
    let that = this;
    $.get({
      url: api.mvList,
      data: {
        keyword: that.data.keyword,
        page: that.data.page,
        size: that.data.size,
        sort: that.data.currentSortType,
        order: that.data.currentSortOrder,
        classifyId: that.data.categoryId,
        userId: that.data.userId
      }
    }).then(function (res) {
      let data = res.data;
      if (data.status === 200) {
        let newMvList = [];
        let mvList = data.data.mvList;
        for (let i = 0; i < mvList.length; i++) {
          let movie = mvList[i];
          movie.imgUrl = 'https://www.yanda123.com/yanda/attach/readFile?size=200&id=' + mvList[i].imgAppendixId;
          newMvList.push(movie);
        }
        that.setData({
          searchStatus: true,
          categoryFilter: false,
          mvList: newMvList,
          filterCategory: data.data.filterclassifyList
        });
      }

      //重新获取关键词
      that.getSearchKeyword();
    });
  },
  onKeywordTap: function (event) {

    this.getSearchResult(event.target.dataset.keyword);

  },
  getSearchResult(keyword) {
    if (keyword === '') {
      keyword = this.data.defaultKeyword.keyword;
    }
    this.setData({
      keyword: keyword,
      page: 1,
      categoryId: 0,
      mvList: []
    });

    this.getmvList();
  },
  openSortFilter: function (event) {
    let currentId = event.currentTarget.id;
    let tmpSortOrder = 'asc';
    switch (currentId) {
      case 'default':
        if (this.data.currentSortOrder == 'asc') {
          tmpSortOrder = 'desc';
        }
        this.setData({
          currentSortType: 'default',
          currentSortOrder: tmpSortOrder,
          categoryFilter: false,
          categoryId: 0
        });
        this.getmvList();
        break;
      case 'nameSort':
        if (this.data.currentSortOrder == 'asc') {
          tmpSortOrder = 'desc';
        }
        this.setData({
          currentSortType: 'name',
          currentSortOrder: tmpSortOrder,
          categoryFilter: false,
          categoryId: 0
        });

        this.getmvList();
        break;
      case 'categorySort':
        if (this.data.currentSortOrder == 'asc') {
          tmpSortOrder = 'desc';
        }
        this.setData({
          currentSortType: 'classify',
          currentSortOrder: tmpSortOrder,
          categoryFilter: !this.data.categoryFilter
        });
        break;
      default:
        //综合排序
        this.setData({
          currentSortType: 'default',
          currentSortOrder: 'desc',
          categoryFilter: false
        });
        this.getmvList();
    }
  },
  selectCategory: function (event) {
    let currentIndex = event.target.dataset.categoryIndex;
    let filterCategory = this.data.filterCategory;
    let currentCategory = null;
    for (let key in filterCategory) {
      if (filterCategory[key].classifyId == currentIndex) {
        filterCategory[key].selected = true;
        currentCategory = filterCategory[key];
      } else {
        filterCategory[key].selected = false;
      }
    }
    this.setData({
      filterCategory: filterCategory,
      categoryFilter: false,
      categoryId: currentCategory.classifyId,
      page: 1,
      mvList: []
    });
    this.getmvList();
  },
  onKeywordConfirm(event) {
    this.getSearchResult(event.detail.value);
  }
})