var utils = require('../../../utils/util.js');
var $ = require('../../../utils/ajax.js');
var appId = 'wx8c025f88b3f63c44';
var appSecret = 'a308a19541497abdab9a2cad360188d3';

//获取应用实例
const app = getApp();
const works = [
  { id: 1, label: '历史记录', icon: 'https://www.yanda123.com/app/time.png' },
  { id: 2, label: '我的收藏', icon: 'https://www.yanda123.com/app/collection_fill.png' },
  { id: 3, label: '消费记录', icon: 'https://www.yanda123.com/app/redpacket.png' },
  { id: 4, label: '在线客服', icon: 'https://www.yanda123.com/app/customerservice.png' },
  { id: 5, label: '帮助反馈', icon: 'https://www.yanda123.com/app/feedback.png' }
]

Page({
  data: {
    workCards: works,
    userInfo: {},
    openid: '',
    session_key: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  handleWorkClick: function () {
    utils.quickTip('功能暂未开放，敬请期待');
  },
  //每次进入页面
  onShow: function () {
    if (!app.globalData.userInfo) {
      this.setData({
        userInfo: {},
        hasUserInfo: false
      })
    }
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        withCredentials: true,
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    let userInfo = e.detail.userInfo;
    if (userInfo) {
      var that = this;
      // 调用login获取code，通过code获取openid，通过openid和当前用户做绑定
      wx.login({
        success: function (res) {
          $.get({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            data: { appid: appId, secret: appSecret, js_code: res.code, grant_type: 'authorization_code' }
          }).then((res) => {
            that.setData({
              session_key: res.data.session_key,
              openid: res.data.openid
            });
            // 通过openid查询微信用户和是否存在
            $.get({
              url: 'https://www.yanda123.com/yanda/user/findWechatIsExist',
              data: { openId: that.data.openid }
            }).then((res) => {
              let data = res.data;
              if (data.status == 200) {
                let userInfo = data.data;
                if (userInfo.userId) {
                  // 用户已存在，用该用户在后台登录
                  console.log('用户ID=' + data.data.userId);
                  that.login(userInfo.userName, userInfo.password);
                } else {
                  // 该微信账号未在yanda注册账号，为其自动生成账号，并绑定openid,然后在yanda登录
                  that.register(that.data.openid, userInfo.nickName, userInfo.avatarUrl);
                }
              }
            });
          })
        }
      });


      app.globalData.userInfo = userInfo;
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      });
    }
  },

  register: function (openId, nickName, avatar) {
    $.post({
      url: 'https://www.yanda123.com/yanda/user/registerByWechat',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        openId: openId,
        nickName: nickName,
        avatar: avatar
      }
    }).then((res) => {
      let data = res.data;
      if (data.status == 200) {
        let userInfo = data.data;
        console.log(userInfo);
        that.login(userInfo.userName, userInfo.passowrd);
      } else {
        console.log('注册微信用户失败:' + data.message);
      }
    })
  },
  login: function (userName, password) {
    $.post({
      url: 'https://www.yanda123.com/yanda/user/login',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        userName: userName,
        password: password
      }
    }).then((res) => {
      let result = res.data;
      if (result.status === -1) {
        utils.quickTip(result.message);
      } else if (result.status === 200) {
        wx.setStorageSync('userInfo', result.data.userInfo);
        wx.setStorageSync('sessionId', result.data.sessionId);
        wx.setStorageSync('token', result.data.token);
      } else {
        util.quickTip('网络错误，请稍后再试');
      }
    }).catch((err) => {
      console.log(err);
    })
  }
})
