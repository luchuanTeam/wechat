var utils = require('../../../utils/util.js'),
  $ = require('../../../utils/ajax.js');
// pages/components/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    scrollTop: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    inputValue: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toHotSearchPage() {
      wx.navigateTo({
        url: '../hotSearch/hotSearch',
      })
    }
  }
})
