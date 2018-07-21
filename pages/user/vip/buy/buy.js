var utils = require('../../../../utils/util.js');
var $ = require('../../../..//utils/ajax.js');
var api = require('../../../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isVip: false,
    expireDay: 0,
    isForever: false,
    chooseOptions: [],
    hasChoosed: 1,
    chooseProduct: {},
    payOptions: [
      // { avatar: 'https://www.yanda123.com/app/ali.png', text: '支付宝支付' },
      {
        avatar: 'https://www.yanda123.com/app/wechat.png',
        text: '微信支付'
      }
      // { avatar: 'https://www.yanda123.com/app/bankcard.png', text: '银行卡支付' },
    ],
    payWay: 0,
    nonceStr: '', // 生成的随机字符串
    outTradeNo: '',
    prepayId: '', //调用统一下单接口返回的数值，调用支付api时需要传入
    payLoading: false // 确认支付按钮状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = wx.getStorageSync('userInfo');
    let isVip = utils.isVip(userInfo);
    let expireDay = 0;
    let isForever = false;
    if (isVip) {
      expireDay = utils.expireToDay(userInfo.vipCard.expTime);
      isForever = userInfo.vipCard.isForever;
    }
    this.setData({
      userInfo: userInfo || {},
      isVip: isVip,
      expireDay: expireDay,
      isForever: isForever
    });
    this.getVipProductList();
  },

  /**
   * 获取会员卡产品列表
   */
  getVipProductList() {
    $.get({
      url: api.VipProductList
    }).then((res) => {
      if (res.data.status == 200) {
        let data = res.data.data;
        for (let i = 0; i < data.length; i++) {
          data[i].sale = utils.Subtr(data[i].oldPrice, data[i].currentPrice);
          if (data[i].timeUnit == 4) {
            data[i].label = '永久会员';
          } else {
            data[i].label = data[i].timeNum + utils.getTimeUnitLabel(data[i].timeUnit);
          }
        }
        this.setData({
          hasChoosed: data[0].id,
          chooseOptions: data,
          chooseProduct: data[0]
        })
      } else {
        utils.quickTip(res.data.message);
      }
    })
  },

  /**
   *  改变购买会员的选择天数 
   */
  changeChoose(e) {
    let choosed = e.currentTarget.dataset.choosed;
    let chooseProduct = {};
    for (let i = 0; i < this.data.chooseOptions.length; i++) {
      if (choosed == this.data.chooseOptions[i].id) {
        chooseProduct = this.data.chooseOptions[i];
      }
    }
    this.setData({
      hasChoosed: choosed,
      chooseProduct: chooseProduct
    });
  },

  /**
   * 支付方式的更改
   */
  changePayWay(e) {
    let payWay = e.currentTarget.dataset.pay;
    this.setData({
      payWay: payWay
    });
  },

  /**
   * 调用后台的接口对字符串进行md5加密获取签名
   */
  _getPaySign(str) {
    var promise = new Promise((resolve, reject) => {
      $.post({
        url: api.GetPaySign,
        data: {
          prepayId: str
        }
      }).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
    return promise;
  },

  /**
   * 提交支付
   */
  paySubmit(e) {
    if (!this.data.payLoading) {
      let outTradeNo = utils.getRandomStr(18) + utils.getTodayStr();
      this.setData({
        payLoading: true,
        outTradeNo: outTradeNo
      });

      let data = {
        openid: wx.getStorageSync('openid'),
        outTradeNo: outTradeNo,
        totalFee: this.data.chooseProduct.currentPrice * 100,
        productId: this.data.chooseProduct.id,
        body: '燕达教育会员中心-会员充值'
      };

      // 调用后台统一下单接口
      this._getOrder(data);
    }
  },

  /**
   * 调用统一下单接口，获取prepayId 和 签名 signType
   */
  _getOrder(data) {
    $.post({
      url: api.Pay,
      data: data
    }).then((res) => {
      if (res.data.status === 200) {
        let result = res.data.data;
        let result_code = result.result_code;
        if (result_code == 'FAIL') {
          let errMsg = result.err_code_des;
          utils.quickTip(errMsg);
          this.setData({
            payLoading: false
          });
        } else {
          // 统一下单成功，保存prepare_id进行下一步的支付操作
          let prepayId = result.prepay_id;
          this.setData({
            prepayId: prepayId
          });
          this._goPay();
        }
      } else {
        utils.quickTip(res.data.message);
        this.setData({
          payLoading: false
        });
      }
    }).catch((err) => {
      console.log(JSON.stringify(err));
      this.setData({
        payLoading: false
      });
    })
  },

  /**
   * 调用微信支付接口
   */
  _goPay() {

    // 先要对数据进行 md5 加密，获取签名后才能调用微信支付接口
    this._getPaySign( this.data.prepayId).then((res) => {
      if (res.data.status == 200) {
        let paySign = res.data.data.paySign;
        wx.requestPayment({
          'timeStamp': res.data.data.timeStamp,
          'nonceStr': res.data.data.nonceStr,
          'package': `prepay_id=${this.data.prepayId}`,
          'signType': 'MD5',
          'paySign': `${paySign}`,
          'success': (res) => {
            console.log('success: ' + JSON.stringify(res));
            this._bindVipCard();
          },
          'fail': (err) => {
            utils.quickTip(err.err_desc);
            console.log('fail: ' + JSON.stringify(err))
          },
          'complete': (res) => {
            this.setData({
              payLoading: false
            });
          }
        });
      } else {
        utils.quickTip(errMsg);
        this.setData({
          payLoading: false
        });
        return;
      }

    }).catch((err) => {
        console.log(err);
        this.setData({
          payLoading: false
        });
    });
  },

  /**
   * 支付成功后绑定会员卡
   */
  _bindVipCard() {
    let userInfo = this.data.userInfo;
    if (userInfo && userInfo.userId) {
      let userId = userInfo.userId,
        nickName = userInfo.nickName,
        productId = this.data.chooseProduct.id;
      $.post({
        url: api.Buy,
        data: {
          userId: userId,
          nickName: nickName,
          productId: productId,
        }
      }).then((res) => {
        console.log('complete: ' + JSON.stringify(res));
        if (res.data.status === 200) {
          this._addPayRecord(1);
          let account = res.data.data.account, //账号
            password = res.data.data.password,
            expTime = res.data.data.expTime,
            userInfo = res.data.data.user;
          wx.setStorageSync('userInfo', userInfo);
          wx.reLaunch({
            url: `../../../msg/msg_success?account=${account}&password=${password}&expTime=${expTime}`
          });
        } else { //绑定不成功
          this._addPayRecord(0);
          this._refundPrepare();
          wx.reLaunch({
            url: '../../../msg/msg_fail'
          });
        }
      }).catch((err) => {
        console.log('fail: ' + JSON.stringify(err));
      });
    }
  },

  _addPayRecord(status) {
    if (!status) return;
    let action = this.data.isVip ? '续费' : '购买';
    $.post({
      url: api.AddPayRecord,
      data: {
        userId: this.data.userInfo.userId,
        payStatus: status,
        payMsg: action + `会员${this.data.chooseProduct.label}`,
        payAmount: this.data.chooseProduct.currentPrice,
        tradeNo: this.data.outTradeNo
      }
    }).then((res) => {
      console.log(JSON.stringify(res));
    }).catch((err) => {
      console.log(JSON.stringify(err));
    });
  },

  /**
   * 退款前的准备，获取加密签名
   */
  _refundPrepare() {
    let data = {
      out_trade_no: this.data.outTradeNo,
      out_refund_no: this.data.outTradeNo,
      total_fee: this.data.chooseProduct.currentPrice * 100,
      refund_fee: this.data.chooseProduct.currentPrice * 100
    };
    this._refund(data);
  },

  _refund(data) {
    $.post({
      url: api.Refund,
      data: data
    }).then((res) => {
      console.log(JSON.stringify(res));
    }).catch((err) => {
      console.log(JSON.stringify(err));
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      payLoading: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})