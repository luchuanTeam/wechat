const EXERCISES = [
  {type: '选择题', text: '在计算器按...', answers:[
    { option: 'A', text: '2484' }, { option: 'B', text: '2384' }, { option: 'C', text: '2284' }
  ], choose: '', correctAnswer: 'A' },
  {
    type: '选择题', text: '在计算器按下...', answers: [
      { option: 'A', text: '2484' }, { option: 'B', text: '2384' }, { option: 'C', text: '2284' }
    ], choose: '', correctAnswer: 'B'
  }
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exercises: EXERCISES,
    currentEx: {},
    num: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = options.title;
    let ex = this.data.exercises[this.data.num];
    this.setData({
      currentEx: ex
    })
    wx.setNavigationBarTitle({
      title: title
    });
  },

  toggleChoose(e) {
    if(!this.data.currentEx.choose) {   // 如果没有选择过，才能答题
      let option = e.currentTarget.dataset.option;
      let choose = 'currentEx.choose';
      this.setData({
        [choose]: option
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})