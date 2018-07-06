Page({
  data: {
    account: '',      // 账号
    password: '',     // 密码
    expTime: ''       // 到期时间
  },
  onLoad: function(options) {
    this.setData({
      account: options.account,
      password: options.password,
      expTime: options.expTime
    })
  },
  comfirm() {
    wx.reLaunch({
      url: '../user/user',
    })
  }
});