// 以下是业务服务器API地址
// 本机开发时使用
 //var WxApiRoot = 'http://localhost:8080/yanda/';
// 云平台部署时使用
 var WxApiRoot = 'https://www.yanda123.com/yanda/';



module.exports = {
  IndexMovies: WxApiRoot + 'movie/getPubMovies',
  IndexClassifyList: WxApiRoot + 'movie/getClassify',
  IndexBanners: WxApiRoot + 'banner/list',

  mvList: WxApiRoot + 'movie/search',  //获得商品列表

  CollectList: WxApiRoot + 'collect/list',  //收藏列表
  CollectAddOrDelete: WxApiRoot + 'collect/addordelete',  //添加或取消收藏

  EpisodeList: WxApiRoot + 'episode/episodes/',
  EpisodeDetail: WxApiRoot + 'episode/getDetailEpisode/',

  CommentList: WxApiRoot + 'comment/list',  //评论列表
  CommentCount: WxApiRoot + 'comment/count',  //评论总数
  CommentPost: WxApiRoot + 'comment/post',   //发表评论
  CommentSave: WxApiRoot + 'comment/saveComment', //保存评论

  SearchIndex: WxApiRoot + 'search/index',  //搜索关键字
  SearchResult: WxApiRoot + 'search/result',  //搜索结果
  SearchHelper: WxApiRoot + 'search/helper',  //搜索帮助
  SearchClearHistory: WxApiRoot + 'search/clearhistory',  //搜索历史清楚

  CollectIndex: WxApiRoot + 'collect/index',       // 我的收藏
  CollectDelete: WxApiRoot + 'collect/delete',      // 删除我的收藏
  CollectAdd: WxApiRoot + 'collect/add',            // 增加我的收藏

  HistoryIndex: WxApiRoot + 'history/index',
  HistoryDelete: WxApiRoot + 'history/delete',
  HistoryUpsert: WxApiRoot + 'history/upsert',
  HistoryRecord: WxApiRoot + 'history/record',
  HistoryDeleteByIds: WxApiRoot + 'history/deleteByIds',

  UserSendCode: WxApiRoot + 'user/sendCode',
  UserBindMobile: WxApiRoot + 'user/bindMobile',
  UserLogin: WxApiRoot + 'user/login',
  UserRegister: WxApiRoot + 'user/registerByWechat',
  UserGetOpenId: WxApiRoot + 'user/getOpenIdFromWeiXin',
  UserCheckExist: WxApiRoot + 'user/findWechatIsExist',
  UserCheckToken: WxApiRoot + 'user/checkToken',

  VipBind: WxApiRoot + 'vip/bindByCardNum',

  Pay: 'https://api.mch.weixin.qq.com/pay/unifiedorder',      // 微信支付调用接口
  Refund: 'https://api.mch.weixin.qq.com/secapi/pay/refund',  // 微信退款调用接口
  GetPaySign: WxApiRoot + 'userPay/getPaySign',      //md5加密生成签名
 
  Buy: WxApiRoot + 'vip/buy'          // 购买或续费会员后，为客户绑定会员调用接口
};