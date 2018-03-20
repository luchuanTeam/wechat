// pages/components/comment/comment.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentInfo: {
      type: Object,
      value: {
        commentId: '',
        userName: '樱木花道',        // 发表评论的用户的用户名
        avatar: '',                 // 用户头像
        agreeCount: 0,              // 点赞数
        createTime: '',             // 评论时间
        commentContent: ''          //评论内容
      }
    }
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
