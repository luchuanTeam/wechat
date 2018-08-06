// 以下是业务服务器API地址
// 本机开发时使用
//var WxApiRoot = 'http://localhost:8080/yanda/';
// 云平台部署时使用
var WxApiRoot = 'https://www.yanda123.com/yanda/';



module.exports = {
  BannerList: WxApiRoot + 'banner/list',

  MoviePubList: WxApiRoot + 'movie/getPubMovies',
  MovieRecent: WxApiRoot + 'movie/recent',
  MovieSearch: WxApiRoot + 'movie/search',  //获得商品列表
  MovieClassify: WxApiRoot + 'movie/getClassify',  //获取视频一级分类
  
  ClassifyPinYin: WxApiRoot + 'classify/getPinyin', //获取中文拼音
  ClassifyList: WxApiRoot + 'classify/getListByType', //获取分类列表
  ClassifyChildList: WxApiRoot + 'classify/getChildListByParentId', //获取子分类列表

  CollectList: WxApiRoot + 'collect/list',  //收藏列表
  CollectAddOrDelete: WxApiRoot + 'collect/addordelete',  //添加或取消收藏

  EpisodeList: WxApiRoot + 'episode/episodes/',
  EpisodeDetail: WxApiRoot + 'episode/getDetailEpisode/',

  CommentList: WxApiRoot + 'comment/list',  //评论列表
  CommentCount: WxApiRoot + 'comment/count',  //评论总数
  CommentPost: WxApiRoot + 'comment/post',   //发表评论
  CommentSave: WxApiRoot + 'comment/saveComment', //保存评论
  CommentAgree: WxApiRoot + 'comment/toggleAgreeCount', //评论点赞

  AgreeList: WxApiRoot + 'userAgree/list',   //获取用户点赞过的评论记录

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
  VipBuy: WxApiRoot + 'vip/buy',          // 购买或续费会员后，为客户绑定会员调用接口

  ProductList: WxApiRoot + 'product/list',

  PayOrder: WxApiRoot + 'pay/getOrder',      // 微信支付调用接口
  PayRefund: WxApiRoot + 'pay/refund',  // 微信退款调用接口
  PaySign: WxApiRoot + 'pay/getPaySign',      //md5加密生成签名
  PayAddRecord: WxApiRoot + 'pay/addRecord',
  PayRecords: WxApiRoot + 'pay/recordList',

  PaperList: WxApiRoot + 'paper/list',

  AttachDownload: WxApiRoot + 'attach/readFile?id=',
  AttachGetUrl: WxApiRoot + 'attach/getUrl'
};