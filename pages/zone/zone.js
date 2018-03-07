const TOP_CATEGORY = [
    { 
      id: 1, 
      label: '胎教', 
      desc: '胎教'
    }
  ]; 
const STYLE_ARR = ['baby-blue', 'pink', 'olive-green', 'orange', 'light-cyan'];
const TESTARR1 = {
  '1': { id: 9, label: '胎教音乐', desc: '胎教音乐'}
  };

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topCategory: [],      // 一级目录
    selected: 1,                    // 被选择的一级目录
    styleArr: STYLE_ARR,            // 二级目录样式数组
    secondCategory: [],        // 选择一级目录对应的二级目录内容
    categoryCache: {}         // 保存已加载的二级目录数据
  },
  /**
   * 二级分类数据加载
   */
  loadSecondCategory: function(id) {
    var that = this;
    wx.request({
      url: "http://www.yanda123.com/yanda/movie/getClassify/" + id,
      data: {},
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.statusCode == 200) {
          let data = res.data;
          let key = 'categoryCache[' + id + ']';
          that.setData({
            selected: id,
            secondCategory: data,
            [key]: data
          });
        }
      },
      fail: function (err) {
        console.log(err)
      }
    });
  },

  /**
   * 点击一级目录更改显示
   */
  changeSelected(e) {
    var that = this;
    let id = e.target.dataset.index;
    if (this.data.categoryCache[id]) {
      that.setData({
        selected: id,
        secondCategory: this.data.categoryCache[id]
      });
    } else {
      that.loadSecondCategory(id);
    }
  },

  /**
   * 跳转到视频列表页面
   */
  toVideoList(e) {
    wx.navigateTo({
      url: '../videoList/videoList',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: "http://www.yanda123.com/yanda/movie/getClassify",
      data: {},
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.statusCode == 200) {
          let data = res.data;
          that.setData({
            topCategory: data
          });
          that.loadSecondCategory(data[0].id);
        }
      },
      fail: function (err) {
        console.log(err)
      }
    });
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