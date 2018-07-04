var $ = require('../../utils/ajax.js');
var api = require('../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize: 8,
    pageNum: 1,
    videoIntros: [],
    canLoadMore: '1',
    classifyId: '',
    classifyName: '',
    classifyPinyin: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取页面传过来的分类ID
    let id = options.classifyId;
    let classifyName = options.classifyName;
    this.setData({
      classifyId: id,
      classifyName: classifyName
    });
    let classifyPinyin = '';
    this.getPinyin(classifyName).then((res) => {
      classifyPinyin = res.data;
      this.setData({
        classifyPinyin: classifyPinyin
      });
    });
    
    this.loadMovies(this.data.pageNum, this.data.pageSize);
  },

  /**
   * 加载视频数据
   */
  loadMovies: function (pageNum, pageSize) {
    var that = this;
    $.get({
      url: api.IndexMovies,
      data: { pageNum: pageNum, pageSize: pageSize, classifyId: this.data.classifyId }
    }).then((res) => {
      if (res.data.status === 200) {
        let movies = res.data.data.list,
          pageNum = that.data.pageNum;

        movies.length >= 8 ? (pageNum++) : (that.setData({ canLoadMore: '0' }));
        that.groupvideoIntros({
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
    });
  },

  getPinyin: function (content) {
    return $.get({ url: 'https://www.yanda123.com/yanda/classify/getPinyin', data: {content: content} });
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