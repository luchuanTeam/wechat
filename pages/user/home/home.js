var utils = require('../../../utils/util.js');
var $ = require('../../../utils/ajax.js');

//获取应用实例
const app = getApp();
const works = [
  { id: 1, label: '历史记录', icon: 'https://www.yanda123.com/app/time.png' },
  { id: 2, label: '我的收藏', icon: 'https://www.yanda123.com/app/collection_fill.png' },
  { id: 3, label: '消费记录', icon: 'https://www.yanda123.com/app/redpacket.png' },
  { id: 4, label: '帮助反馈', icon: 'https://www.yanda123.com/app/feedback.png' }
]

Page({
  data: {
    workCards: works,
    userInfo: {},
    openid: '',
    session_key: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canUserLoad: wx.canIUse('showLoading')
  },
  //事件处理函数
  handleWorkClick: function () {
    utils.quickTip('功能暂未开放，敬请期待');
  },
  //每次进入页面
  onShow: function () {
    if (!wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: {},
        hasUserInfo: false
      })
    }
  },
  onLoad: function () {
    let userInfo = wx.getStorageSync('userInfo');    
    console.log(userInfo);
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
        wx.setStorageSync('userInfo', result.data.userInfo);
        wx.setStorageSync('sessionId', result.data.sessionId);
        wx.setStorageSync('token', result.data.token);
        this.setData({
          userInfo: result.data.userInfo,
          hasUserInfo: true
        });
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
      app.globalData.userInfo = userInfo;
    } else {
      utils.quickTip('无法获取用户信息');
    }
  }
})
