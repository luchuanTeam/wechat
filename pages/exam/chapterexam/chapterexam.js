var $ = require('../../../utils/ajax.js');
var api = require('../../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    exercises: [],
    currentEx: {},
    quIdArr: [],
    num: 0,
    total: 0,
    id: '',
    module: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let title = options.title;
    let id = options.id;
    let module = options.module;

    wx.setNavigationBarTitle({
      title: title
    });

    this.setData({
      id: id,
      module: module
    });

    this.getList().then((res) => {
      let data = res.data;
      let quIdArr = [];
      if (data.status == 200) {
        // 存储已查询的题目id
        for (let i = 0, len = data.data.length; i < len; i++) {
          quIdArr.push(data.data[i].questionId);
        }

        let ex = data.data[this.data.num];
        this.setData({
          exercises: data.data,
          currentEx: ex,
          quIdArr: quIdArr
        });
      }
    })
    this.getTotal();
  },

  getList() {
    let id = this.data.id;
    let module = this.data.module;
    return $.ajax({
      url: api.QuestionList,
      data: {
        id: id,
        module: module
      }
    });
  },

  getTotal() {
    let id = this.data.id;
    let module = this.data.module;
    $.ajax({
      url: api.QuestionTotal,
      data: {
        id: id,
        module: module
      }
    }).then((res) => {
      let data = res.data;
      if (data.status == 200) {
        this.setData({
          total: data.data
        });
      }
    })
  },

  toggleChoose(e) {
    if (!this.data.currentEx.choose) { // 如果没有选择过，才能答题
      let option = e.currentTarget.dataset.option,
        n = this.data.num,
        _currentEx = this.data.currentEx,
        _exercises = this.data.exercises;
      _currentEx.choose = option;
      _exercises[n] = _currentEx;
      this.setData({
        currentEx: _currentEx,
        exercises: _exercises
      });
    }
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
    if (n < (this.data.total - 1)) {

      // 若现有题目已做完，而还未到达题库总数，继续向服务器获取新题
      if (n >= this.data.exercises.length - 1) {
        this.getList().then((res) => {
          let data = res.data;
          if (data.status == 200) {
            let quIdArr = this.data.quIdArr;
            let addExercises = [];
            // 去除重复题目
            for (let i = 0, len = data.data.length; i < len; i++) {
              if (quIdArr.indexOf(data.data[i].questionId) == -1) {
                quIdArr.push(data.data[i].questionId);
                addExercises.push(data.data[i]);
              }
            }
            if (addExercises.length == 0) { //如果获取的新题都是重复的，继续向服务器获取新题
              let that = this; 
              setTimeout(function() {
                that.toNextExam();
              }, 5000);
            } else {
              // 将新题追加到现有题库中
              let newExercises = this.data.exercises.concat(addExercises);
              n++;
              this.setData({
                exercises: newExercises,
                quIdArr: quIdArr,
                num: n,
                currentEx: newExercises[n]
              })
            }
          }
        })
      } else {
        n++;
        this.setData({
          num: n,
          currentEx: this.data.exercises[n]
        });
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})