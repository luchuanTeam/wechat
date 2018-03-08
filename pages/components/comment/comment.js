// pages/components/comment/comment.js
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
    showTip: '0'  //展示举报， '1'代表展示
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toggleShowTip() {
      this.setData({
        showTip: this.data.showTip === '0'? '1':'0'
      });
    }
  }
})
