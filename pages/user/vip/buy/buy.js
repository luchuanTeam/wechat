var utils = require('../../../../utils/util.js');
var $ = require('../../../../utils/ajax.js');
var pay = require('../../../../utils/pay.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isVip: false,
    chooseOptions: [
      { time: 12, currentPrice: 178, oldPrice: 198, sale: 20 },
      { time: 3, currentPrice: 45, oldPrice: 58, sale: 13 }, 
      { time: 1, currentPrice: 15, oldPrice: 19.8, sale: 4.8}
    ],
    hasChoosed: 0,
    payOptions: [
      // { avatar: 'https://www.yanda123.com/app/ali.png', text: '支付宝支付' },
      { avatar: 'https://www.yanda123.com/app/wechat.png', text: '微信支付' }
      // { avatar: 'https://www.yanda123.com/app/bankcard.png', text: '银行卡支付' },
    ],
    payWay: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo'); 
    console.log(JSON.stringify(userInfo));
    let isVip = utils.isVip(userInfo);
    this.setData({
      userInfo: userInfo || {},
      isVip: isVip
    });
  },

  changeChoose(e) {
    let choosed = e.currentTarget.dataset.choosed;
    this.setData({
      hasChoosed: choosed  
    });
  },

  changePayWay(e) {
    let payWay = e.currentTarget.dataset.pay;
    this.setData({
      payWay: payWay
    });
  },
  /**
   * 提交支付
   */
  paySubmit(e) {
    let openid = wx.getStorageSync('openid');
    let data = {
      appid: 'wx8c025f88b3f63c44',
      mch_id: '1508748871',
      nonce_str: utils.getRandomStr(32),
      body: 'JSAPI',
      out_trade_no: '20150806125346',
      total_fee: 10,
      spbill_create_ip: '123.12.12.123',
      notify_url: 'https://www.baidu.com',
      trade_type: 'JSAPI',
      openid: openid
    };
    let sign = pay.getPaySign(data);
    let body = `<xml><appid>${data.appid}</appid><mch_id>${data.mch_id}</mch_id>
      <nonce_str>${data.nonce_str}</nonce_str><body>${data.body}</body><out_trade_no>
      ${data.out_trade_no}</out_trade_no><total_fee>${data.total_fee}</total_fee>
      <spbill_create_ip>${data.spbill_create_ip}</spbill_create_ip><notify_url>
      ${data.notify_url}</notify_url><trade_type>${data.trade_type}</trade_type>
      <openid>${data.openid}</openid><sign>${sign}</sign></xml>`;
    console.log(body);
    $.post({
      url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      header: { "Content-Type": "text/plain" },
      dataType: 'UTF-8',
      data: body
    }).then((res)=> {
      console.log('success' + JSON.stringify(res));
    }).catch((err)=> {
      console.log('fail');
    })
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
})