var utils = require('../../utils/util.js');
var $ = require('../../utils/ajax.js');

//获取应用实例
const app = getApp();
const works = [
  { id: 1, label: '历史记录', icon: 'https://www.yanda123.com/app/time.png', url: '/pages/user/history/history' },
  { id: 2, label: '我的收藏', icon: 'https://www.yanda123.com/app/collection_fill.png', url: '/pages/user/collect/collect' },
  { id: 3, label: '消费记录', icon: 'https://www.yanda123.com/app/redpacket.png', url: '/pages/user/redpacket/redpacket' },
  { id: 4, label: '帮助反馈', icon: 'https://www.yanda123.com/app/feedback.png', url: '/pages/user/feedback/feedback' },
  { id: 5, label: '会员管理', icon: 'https://www.yanda123.com/app/vip.png', url: '/pages/user/vip/vip' },
  { id: 6, label: '更多设置', icon: 'https://www.yanda123.com/app/setting.png', url: '/pages/setting/mySetting/mySetting' }
]

Page({
  data: {
    workCards: works,
    userInfo: {},
    isVip: false,
    expireDay: 0,
    openid: '',
    session_key: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canUserLoad: wx.canIUse('showLoading')
  },
  //事件处理函数
  handleWorkClick: function (e) {
    if (this.data.userInfo && this.data.userInfo.userId) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      });
    } else {
      utils.quickTip('请先登录');
    }
  },
  /**
   * 跳转到账号设置页面
   */
  toAccountSetting: function (e) {
    wx.navigateTo({
      url: '/pages/setting/account/account',
    });
  },

  //每次进入页面
  onShow: function () {
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      this.setData({
        userInfo: {},
        hasUserInfo: false
      })
    } else {
      let isVip = utils.isVip(userInfo);
      let expireDay = 0;
      if (isVip) {
        expireDay = utils.expireToDay(userInfo.vipCard.expTime);
      }
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true,
        isVip: isVip,
        expireDay: expireDay
      })
    }
  },
  onLoad: function () {
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      var that = this;
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.initUserInfo(res.userInfo);
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      var that = this;
      wx.getUserInfo({
        success: res => {
          that.initUserInfo(res.userInfo);
        }
      })
    }
  },
  getUserInfo: function (e) {
    let userInfo = e.detail.userInfo;
    this.initUserInfo(userInfo);
  },
  /**
   * 通过微信用户信息在后台注册随机账号，并与微信做绑定
   */
  register: function (openId, nickName, avatar, gender) {
    $.post({
      url: 'https://www.yanda123.com/yanda/user/registerByWechat',
      data: {
        openId: openId,
        nickName: nickName,
        avatar: avatar,
        sex: gender
      }
    }).then((res) => {
      let data = res.data;
      if (data.status == 200) {
        let userInfo = data.data;
        this.login(userInfo.userName, userInfo.passowrd);
      } else {
        console.log('注册微信用户失败:' + data.message);
      }
    })
  },
  /**
   * 在后台进行登录
   */
  login: function (userName, password) {
    $.post({
      url: 'https://www.yanda123.com/yanda/user/login',
      data: {
        userName: userName,
        password: password
      }
    }).then((res) => {
      if (this.data.canUserLoad) {
        wx.hideLoading();
      }
      let result = res.data;
      if (result.status === -1) {
        utils.quickTip(result.message);
      } else if (result.status === 200) {
        let ydUser = result.data.userInfo;
        app.globalData.userInfo = ydUser;
        // 判断用户是否已绑定手机号，若无则强制跳转到绑定手机界面
        if (!ydUser.mobile) {
          wx.showToast({
            title: '您还未绑定手机号',
            icon: 'none',
            mask: true,
            success: function () {
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/setting/mobile/mobile'
                });
              }, 1000);
            }
          });
          return;
        } else {
          wx.setStorageSync('userInfo', ydUser);
          wx.setStorageSync('sessionId', result.data.sessionId);
          wx.setStorageSync('token', result.data.token);

          let isVip = utils.isVip(ydUser);
          let expireDay = 0;
          if (isVip) {
            expireDay = utils.expireToDay(ydUser.vipCard.expTime);
          }
          this.setData({
            userInfo: ydUser,
            hasUserInfo: true,
            isVip: isVip,
            expireDay: expireDay
          });
        }

      } else {
        utils.quickTip('网络错误，请稍后再试');
      }
    }).catch((err) => {
      if (this.data.canUserLoad) {
        wx.hideLoading();
      }
      console.log(err);
    })
  },
  /**
   * 在微信获取用户信息后进行用户信息初始化
   */
  initUserInfo: function (userInfo) {
    if (this.data.canUserLoad) {
      wx.showLoading({
        title: '正在登录',
        mask: true
      })
    }
    if (userInfo) {
      var that = this;
      // 调用login获取code，通过code获取openid，通过openid和当前用户做绑定
      wx.login({
        success: function (res) {
          $.get({
            url: 'https://www.yanda123.com/yanda/user/getOpenIdFromWeiXin',
            data: { js_code: res.code }
          }).then((res) => {
            let data = res.data.data;
            that.setData({
              session_key: data.session_key,
              openid: data.openid
            });
            // 通过openid查询微信用户和是否存在
            $.get({
              url: 'https://www.yanda123.com/yanda/user/findWechatIsExist',
              data: { openId: that.data.openid }
            }).then((res) => {
              let data = res.data;
              if (data.status == 200) {
                let yandaUser = data.data;
                if (yandaUser.userId) {
                  // 用户已存在，用该用户在后台登录
                  console.log('用户ID=' + yandaUser.userId);
                  that.login(yandaUser.userName, yandaUser.password);
                } else {
                  // 该微信账号未在yanda注册账号，为其自动生成账号，并绑定openid,然后在yanda登录
                  that.register(that.data.openid, userInfo.nickName, userInfo.avatarUrl, userInfo.gender);
                }
              }
            });
          })
        }
      });
    } else {
      utils.quickTip('无法获取用户信息');
    }
  },
  vipLogin: function() {
    wx.navigateTo({
      url: '/pages/user/login/login'
    });
  }
})
