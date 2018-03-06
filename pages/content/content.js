const stations = [
    { imgUrl: 'http://www.yanda123.com/app/taijiao.png', desc: '胎教' },
    { imgUrl: 'http://www.yanda123.com/app/zaojiao.png', desc: '早教（1-3岁）' },
    { imgUrl: 'http://www.yanda123.com/app/youjiao.png', desc: '幼教（4-6岁）' },
    { imgUrl: 'http://www.yanda123.com/app/xiaoxue.png', desc: '小学课程' },
    { imgUrl: 'http://www.yanda123.com/app/chuzhong.png', desc: '初中课程' },
    { imgUrl: 'http://www.yanda123.com/app/gaozhong.png', desc: '高中课程' },
    { imgUrl: 'http://www.yanda123.com/app/guoxue.png', desc: '国学' },
    { imgUrl: 'http://www.yanda123.com/app/shougong.png', desc: '手工教程' }
]

const videoStations = [
    {
      mvName: '',
      mvIntro: ' 送綦母潜落第还乡_王维 （唐代）',
      imgUrl: 'http://www.yanda123.com/app/poem.png', 
      classifyName: '国学/古诗词系列', 
      isVideoImg: '1'
    }
]

const obj = {
  imgUrl: 'http://www.yanda123.com/app/poem.png', desc: ' 送綦母潜落第还乡_王维 （唐代）',
  kind: '国学/古诗词系列', isVideoImg: '1'
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stations: stations,
    videoStations: videoStations,
    loadMore: 0
  },
  /**
   * 加载视频数据
   */
  loadMovies: function(pageNum, pageSize) {
    var that = this;
    wx.request({
      url: "http://www.yanda123.com/yanda/movie/list",
      data: { pageNum: pageNum, pageSize: pageSize },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.data.status == 200) {
          let data = res.data.data.list;
          let movies = [];
          for (var i = 0; i < data.length; i++) {
            let movie = data[i];
            movie.desc = movie.mvName;
            movie.imgUrl = 'http://www.yanda123.com/yanda/attach/readFile?size=500&id='+data[i].imgAppendixId;
            movie.isVideoImg = '1';
            movies.push(movie);
          }
          that.setData({
            videoStations: movies
          });
        }
      },
      fail: function (err) {
        console.log(err)
      }
    });
  },
  loadBanners: function() {
    var that = this;
    wx.request({
      url: "http://www.yanda123.com/yanda/banner/list",
      data: { pageNum: 1, pageSize: 4 },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.data.status == 200) {
          let data = res.data.data.list;
          let urlArr = [];
          for (let i = 0; i < data.length; i++) {
            let url = 'http://www.yanda123.com/yanda/attach/readFile?size=800&id=' + data[i].appendixId;
            urlArr.push(url);
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadBanners();
    this.loadMovies(1, 4);
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

  },

  /**
  * 页面上拉触底事件
  */
  onReachBottom() {
    if(true) {        // 此处应该增加一个标记，表面可以后台还可以加载更多，不用每次触底都调后台
      this.setData({
        loadMore: 1   //可加载的时候应该显示loading状态
      });
      let arrs = this.data.videoStations;
      arrs.push(obj);
      arrs.push(obj);
      setTimeout(()=>{
        this.setData({
          videoStations: arrs,
          loadMore: 0
        });
      }, 1000);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})