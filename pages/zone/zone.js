
const TOP_CATEGORY = ['胎教', '早教(1-3岁)', '幼教(4-6岁)', '小学课程', '初中课程', '高中课程', '国学', '手工课程'];
const STYLE_ARR = ['baby-blue', 'pink', 'olive-green', 'orange', 'light-cyan'];
const TESTARR1 = ['胎教音乐', '国学胎教(音频)'];
const TESTARR2 = ['小学语文(1-6年级)', '小学数学(1-6年级)', '小学英语(1-6年级)'];
const TESTARR3 = ['helloworld', 'helloworld', 'helloworld', 'helloworld', 'helloworld', 'helloworld', 'helloworld', 'helloworld']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topCategory: TOP_CATEGORY,
    selected: 0,
    styleArr: STYLE_ARR,
    secondCategory: TESTARR1
  },

  /**
   * 点击一级目录更改显示
   */
  changeSelected(e) {
    let data = [];
    if(e.target.dataset.index === 0){
      data = TESTARR1;
    } else if (e.target.dataset.index === 1) {
      data = TESTARR2;
    } else {
      data = TESTARR3;
    }
    this.setData({
      selected: e.target.dataset.index,
      secondCategory: data
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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