const TIME= 2* 60 * 60* 1000;
const utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    time: TIME,
    hour: '',
    minute: '',
    second: '',
    start: true,
    currentEx: {
      text: '找出带横线字的正确读音',
      question: '(藐)视',
      answers: [
        {option: 'A', text: 'mao' },
        {option: 'B', text: 'miao' }
      ]
    },
    num: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = options.title;
    this.setData({
      title: title
    });
    this.counter();
  },

  /**
   * 计时
   */
  counter() {
    let time = this.data.time;
    setInterval(()=> {
      if(this.data.start) {
        time = time - 1000;
        let hour = ~~(time / 3600000);
        let remainder = time % 3600000;
        let minute = ~~(remainder / 60000);
        let second = (remainder % 60000) / 1000;
        hour = utils.formatNumber(hour);
        minute = utils.formatNumber(minute);
        second = utils.formatNumber(second);
        this.setData({
          time: time,
          hour: hour,
          minute: minute,
          second: second
        })
      }
      
    }, 1000);
  },

  toggleCounter() {
    this.setData({
      start: !this.data.start
    });
  },

  radioChange: function (e) {

    var answers = this.data.currentEx.answers;
    for (let i = 0, len = answers.length; i < len; ++i) {
      answers[i].checked = answers[i].option == e.detail.value;
    }
    let _answers = 'currentEx.answers'
    this.setData({
      [_answers]: answers
    });
  },

  toPrevExam() {

  },

  toNextExam() {

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