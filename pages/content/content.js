const stations = [
  [
    {imgUrl: '../../../resources/images/chuzhong.png', desc: '初中'},
    {imgUrl: '../../../resources/images/chuzhong.png', desc: '初中'},
    {imgUrl: '../../../resources/images/chuzhong.png', desc: '初中'},
    {imgUrl: '../../../resources/images/chuzhong.png', desc: '初中'}
  ],
  [
    { imgUrl: '../../../resources/images/chuzhong.png', desc: '幼教(4-6岁)' },
    { imgUrl: '../../../resources/images/chuzhong.png', desc: '初中' },
    { imgUrl: '../../../resources/images/chuzhong.png', desc: '初中' },
    { imgUrl: '../../../resources/images/chuzhong.png', desc: '初中' }
  ]
]


Page({

  /**
   * 页面的初始数据
   */
  data: {
    stations: stations
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: "http://www.yanda123.com/yanda/banner/list",
      data: {pageNum: 1, pageSize: 4},
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.data.status == 200) {
          var data = res.data.data.list;
          var urlArr = [];
          for (var i = 0; i < data.length; i++) {
            urlArr.push(data[i].imgUrl);
          }
          that.setData({
            imgUrls: urlArr
          });
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
  onPullDownRefresh: function (e) {
    console.dir(e); 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})