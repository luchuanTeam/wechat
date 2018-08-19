const TIME= 2* 60 * 60* 1000;
const utils = require('../../../utils/util.js');
var $ = require('../../../utils/ajax.js');
var api = require('../../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: TIME,
    hour: '',
    minute: '',
    second: '',
    start: true,
    exercises: [],
    currentEx: {
      questionName: '找出带横线字的正确读音',
      questionContent: '(藐)视',
      answer: 'A',      //正确答案选项
      answerA: 'mao',
      answerB: 'miao',
      choose: '',       //选择的选项
      chooseA: false,   //选项A勾选状态
      chooseB: false    //选项B勾选状态
    },
    num: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let module = options.module;

    $.ajax({
      url: api.QuestionList,
      data: {
        id: id,
        module: module
      }
    }).then((res) => {
      let data = res.data;
      if (data.status == 200) {
        let ex = data.data[this.data.num];
        this.setData({
          exercises: data.data,
          currentEx: ex
        });
      }
    })

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
    let choose = e.detail.value;
    let _choose = 'currentEx.choose';
    let _chooseOption = 'currentEx.choose' + choose;
    let _chooseA = 'currentEx.chooseA';
    let _chooseB = 'currentEx.chooseB';
    let _chooseC = 'currentEx.chooseC';
    let _chooseD = 'currentEx.chooseD';
    let _newEx = 'exercises[' + this.data.num + ']';
    // 先将所有选项重置
    this.setData({
      [_chooseA]: false,
      [_chooseB]: false,
      [_chooseC]: false,
      [_chooseD]: false
    });
    // 重新勾选选项
    this.setData({
      [_choose]: choose,
      [_chooseOption]: true
    });
    // 更新数组里的题目
    this.setData({
      [_newEx]: this.data.currentEx
    });
  },

  toPrevExam() {
    let n = this.data.num;
    if (n > 0) {
      n--;
      this.setData({
        num: n,
        currentEx: this.data.exercises[n]
      });
    }
  },

  toNextExam() {
    let n = this.data.num;
    if (n < this.data.exercises.length - 1) {
      n++;
      this.setData({
        num: n,
        currentEx: this.data.exercises[n]
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