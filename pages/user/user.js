Page({
  data: {
    userInfo: {}
  },
  onLoad: function () {
    
  },
  toOtherPage(e) {
    let pageName = e.currentTarget.dataset.page + '/' + e.currentTarget.dataset.page;
    wx.navigateTo({
      url: '../settingFolder/' + pageName ,
    });
  }
})