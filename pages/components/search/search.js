var utils = require('../../../utils/util.js');
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
      if(/*data !== ''*/ true) {
        wx.navigateTo({
          url: '../video/video?episodeId=1',
        });
      } else {
        wx.showToast({
          title: '请输入搜索内容',
          icon: 'none',
          mask: true,
          complete: ()=> {
            setTimeout(function () {
              wx.hideToast();
            }, 1000)
          }
        });
      }
    }
  }
})
