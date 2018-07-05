//app.js
App({
  onShow: function () {
    let userInfo = wx.getStorageSync('userInfo');
    // 判断用户是否已绑定手机号，若无则强制跳转到绑定手机界面
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      // 这里是为了对之前已经登录的用户强制绑定手机号
      if (!userInfo.mobile) {
        wx.showToast({
          title: '您还未绑定手机号',
          icon: 'none',
          mask: true,
          success: function () {
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/settingFolder/mobile/mobile'
              });
            }, 1000);
          }
        });
        return;
      }
    }
  },
  globalData: {
    userInfo: null,
    selected: '1'
  },
  /**
   * 全局背景音频管理器
   */
  backgroundAudioManager: wx.getBackgroundAudioManager()
})