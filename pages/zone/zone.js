const $ = require('../../utils/ajax.js');
const STYLE_ARR = ['baby-blue', 'pink', 'olive-green', 'orange', 'light-cyan'];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topCategory: [],      // 一级目录
    selected: '',                    // 被选择的一级目录
    styleArr: STYLE_ARR,            // 二级目录样式数组
    secondCategory: [],        // 选择一级目录对应的二级目录内容
    categoryCache: {},         // 保存已加载的二级目录数据
    oneLevName: ''
  },
  /**
   * 二级分类数据加载
   */
  loadSecondCategory: function(id) {
    $.get({ url: "https://www.yanda123.com/yanda/movie/getClassify/" + id})
     .then((res)=> {
       if (res.statusCode == 200) {
         let data = res.data;
         let key = 'categoryCache[' + id + ']';
         this.setData({
           selected: id,
           secondCategory: data,
           [key]: data
         });
       }
     }).catch((err)=>{
       console.log(err);
     });
  },

  /**
   * 点击一级目录更改显示
   */
  changeSelected(e) {
    let id = e.target.dataset.id;
    let name = e.target.dataset.name;
    getApp().globalData.selected = id;
    if (this.data.categoryCache[id]) {
      this.setData({
        selected: id,
        secondCategory: this.data.categoryCache[id],
        oneLevName: name
      });
    } else {
      this.loadSecondCategory(id);
    }
  },

  /**
   * 跳转到视频列表页面
   */
  toVideoList(e) {
    let twoLevName = e.target.dataset.name;
    wx.navigateTo({
      url: '../videoList/videoList?classifyId=' + e.target.dataset.id + '&classifyName=' + this.data.oneLevName + '/' + twoLevName,
    });
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
  onShow: function (options) {
    // 获取从页面传递过来的分类id
    let id = getApp().globalData.selected;
    this.setData({
      selected: id
    });

    $.get({ url: 'https://www.yanda123.com/yanda/movie/getClassify' })
      .then((res) => {
        if (res.statusCode == 200) {
          let data = res.data;
          this.setData({
            topCategory: data
          });
          // 设置当前选中的一级分类名称
          for (let i = 0; i < data.length; i++ ) {
            if (data[i].id == id) {
              this.setData({
                oneLevName: data[i].label
              });
            }
          }
          this.loadSecondCategory(id);
        }
      }).catch((err) => {
        console.log(err);
      });
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