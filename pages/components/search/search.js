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
  }
})
