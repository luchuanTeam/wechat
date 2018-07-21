var $ = require('../../utils/ajax.js');
var utils = require('../../utils/util.js');
var api = require('../../config/api.js');
let filter = require('../../utils/filter.js');

Page(filter.identityFilter({

  /**
   * 页面的初始数据
   */
  data: {
    papers: [],
    loadMore: 0,
    pageNum: 1,
    pageSize: 4,
    canLoadMore: '1',          // 是否可以加载更多视频数据
    downLoading: false,
    downProccess: 0
  },

  /**
   * 加载视频数据
   */
  loadPapers: function (pageNum, pageSize) {
    $.get({
      url: api.PaperList,
      data: { pageNum: pageNum, pageSize: pageSize }
    }).then((res) => {
      if (res.data.status === 200) {
        let list = res.data.data.list, pageNum = this.data.pageNum;
        list.length >= 8 ? (pageNum++) : (this.setData({ canLoadMore: '0' }));
        let papers = this.data.papers;
        for (let i = 0; i < list.length; i++) {
          papers.push(list[i]);
        }
        this.setData({
          papers: papers,
          pageNum: pageNum
        })
      }
    }).catch((err) => {
      console.log(err);
    });
  },

  paperDownload(e) {
    let appendixId = e.currentTarget.dataset.id;
    $.get({
      url: api.AttachGetUrl,
      data: { id: appendixId}
    }).then((res) => {
      if (res.data.status == 200) {
        const downloadTask = utils.downFile(res.data.data);
        this.setData({
          downLoading: true
        });
        downloadTask.onProgressUpdate((res) => {
          this.setData({
            downProccess: res.progress
          });
          if (res.progress == 100) {
            this.setData({
              downLoading: false
            });
          }
        })
      } else {
        utils.quickTip(res.data.message);
      }
    })
  },

  /**
  * 页面上拉触底事件
  */
  onReachBottom() {
    if (this.data.canLoadMore === '1') {
      this.loadPapers(this.data.pageNum, this.data.pageSize);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadPapers(this.data.pageNum, this.data.pageSize);
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
}))