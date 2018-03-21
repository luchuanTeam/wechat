var $ = require('../../utils/ajax.js');

const stations = [
  { id: 1, imgUrl: 'https://www.yanda123.com/app/taijiao.png', desc: '胎教' },
  { id: 2, imgUrl: 'https://www.yanda123.com/app/zaojiao.png', desc: '早教（1-3岁）' },
  { id: 3, imgUrl: 'https://www.yanda123.com/app/youjiao.png', desc: '幼教（4-6岁）' },
  { id: 4, imgUrl: 'https://www.yanda123.com/app/xiaoxue.png', desc: '小学课程' },
  { id: 5, imgUrl: 'https://www.yanda123.com/app/chuzhong.png', desc: '初中课程' },
  { id: 6, imgUrl: 'https://www.yanda123.com/app/gaozhong.png', desc: '高中课程' },
  { id: 7, imgUrl: 'https://www.yanda123.com/app/guoxue.png', desc: '国学' },
  { id: 8, imgUrl: 'https://www.yanda123.com/app/shougong.png', desc: '手工教程' }
]


Page({

  /**
   * 页面的初始数据
   */
  data: {
    stations: stations,
    videoIntros: [],
    loadMore: 0,
    pageNum: 1,
    pageSize: 4,
    canLoadMore: '1'          // 是否可以加载更多视频数据
  },
  /**
   * 加载视频数据
   */
  loadMovies: function (pageNum, pageSize) {
    $.get({
      url: "https://www.yanda123.com/yanda/movie/getPubMovies",
      data: { pageNum: pageNum, pageSize: pageSize }
    }).then((res) => {
      if (res.data.status === 200) {
        let movies = res.data.data.list,
          pageNum = this.data.pageNum;
        movies.length >= 4 ? (pageNum++) : (this.setData({ canLoadMore: '0' }));
        this.groupvideoIntros({
          movies: movies,
          pageNum: pageNum
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  /**
   * 组合 videoStations 数据
   */
  groupvideoIntros(data) {
    let videoIntros = this.data.videoIntros,
      movies = data.movies,
      pageNum = data.pageNum;
    for (let i = 0; i < movies.length; i++) {
      let movie = movies[i];
      movie.imgUrl = 'https://www.yanda123.com/yanda/attach/readFile?size=500&id=' + movies[i].imgAppendixId;
      videoIntros.push(movie);
    }
    this.setData({
      videoIntros: videoIntros,
      pageNum: pageNum
    })
  },
  /**
  * 加载分类
  */
  loadClassify: function () {
    var that = this;
    $.get({ url: 'https://www.yanda123.com/yanda/movie/getClassify' })
      .then((res) => {
        if (res.statusCode == 200) {
          let data = res.data;
          let classifies = data;
          for (let i = 0; i < classifies.length; i++) {
            classifies[i].imgUrl = classifies[i].iconUrl;
          }
          that.setData({
            stations: classifies
          });
        }
      }).catch((err) => {
        console.log(err);
      });
  },


  loadBanners: function () {
    var that = this;
    $.get({
      url: 'https://www.yanda123.com/yanda/banner/list',
      data: { pageNum: 1, pageSize: 4 }
    }).then((res) => {
      if (res.data.status == 200) {
        let data = res.data.data.list;
        let urlArr = [];
        for (let i = 0; i < data.length; i++) {
          let url = 'https://www.yanda123.com/yanda/attach/readFile?size=800&id=' + data[i].appendixId;
          urlArr.push(url);
        }
        that.setData({
          imgUrls: urlArr
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadBanners();
    this.loadClassify();
    this.loadMovies(this.data.pageNum, this.data.pageSize);
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
    if (this.data.canLoadMore === '1') {
      this.loadMovies(this.data.pageNum, this.data.pageSize);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})