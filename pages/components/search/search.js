var utils = require('../../../utils/util.js'),
  $ = require('../../../utils/ajax.js');
// pages/components/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    bindKeyInput: function (e) {
      this.setData({
        inputValue: e.detail.value
      })
    },
    search() {
      let data = utils.trim(this.data.inputValue);
      if(data !== '') {
        this.doSearch(data);
      } else {
        utils.quickTip('请输入搜索内容');
      }
    },
    doSearch(searchVal) {
      $.get({
        url: 'https://www.yanda123.com/yanda/movie/search',
        data: { searchVal: searchVal}
      }).then((res) => {
        utils.quickTip(res.data.message);
      }).catch((err) => {
        console.log(err);
      });
    },
    toHotSearchPage() {
      wx.navigateTo({
        url: '../hotSearch/hotSearch',
      })
    }
  }
})
