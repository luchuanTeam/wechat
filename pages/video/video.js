const utils = require('../../utils/util.js'),
  $ = require('../../utils/ajax.js'),
  commentStore = require('../../store/commentStore.js'),
  api = require('../../config/api.js');

const REFRESH = 1,
  _commentList = 'commentData.commentList',
  _video = 'videoData.video';

const app = getApp();

let filter = require('../../utils/filter.js');

Page(filter.identityFilter({
  /**
   * 页面的初始数据
   */
  data: {
    initialTime: 0,
    currentPlayTime: 0, 
    videoContext: null,
    videoIconUrl: 'https://www.yanda123.com/app/live-select.png',
    commentIconUrl: 'https://www.yanda123.com/app/message.png',
    mvType: 1,               //播放的媒介类型  1：视频 2：音频
    progress: 0,            // 音频进度条播放进度
    currentProcess: '00:00',     // 音频已播放时间
    totalProcess: '00:00',       // 音频总播放时间
    duration: 0,                // 音频总时长数值
    userInfo: '',           // 已登录的用户信息
    mvId: '',            //从页面传过来的视频ID参数
    episodeCount: '',
    episodeList: [],
    currentEpisode: {
      episodeId: 1,
      episodeNum: 1
    },
    tip: '',
    playType: 1,
    playTypeText: '顺序播放',
    showCenterPlayBtn: false,
    textAreaFocus: false,
    selected: '1',        // 决定显示视频组件或者评论组件, '1'代表视频组件, '2'代表评论组件
    videoData: {        // 视频组件的状态数据
      video: {
        mvSrc: '',                           // 视频地址
        imgSrc: '',                           //视频封面地址
        episodeName: '',                  // 视频标题
        episodeIntro: '',
        episodeId: '1',                          // 视频id
        episodeNum: 1                           // 当前正在播放的集数          
      },
      showVideoHiddenIntro: '0',  //  控制隐藏简介的显示状态, '1'代表显示
      playing: 0,               // 正在播放的集数，控制绿色三角形的显示
      showHideEpisode: '0'      // 控制全部集数的组件的显示状态, '1'代表显示
    },
    commentData: {
      criteria: '1',            // 评论的展示类型 1最新 2所有 3精华
      commentList: [],          // 评论列表数
      modelInput: '0',           // 评论模态框的展示, 0 隐藏, 1 显示
      modelChildComment: '0',   // 用于确定父评论下 子评论列表页面 的展示 1 显示 0 隐藏
      parentComment: {}       // 用于存储父评论，当要获取某一评论的所有子评论时，用该对象存储点击的父评论
    },
    agreeChangeComments: {},
    childComments: {}       // 存储父评论的子评论 key:父评论Id, value : {} 包含comments 属性，该属性对应的值是父评论的子评论列表
  },

  /**
   * 点击改变展示的是视频内容或评论内容
   */
  changeSelected(e) {
    let index = e.currentTarget.dataset.index;
    let videoIconUrl = '';
    let commentIconUrl = '';
    if (index == '1') {
      videoIconUrl = 'https://www.yanda123.com/app/live-select.png';
      commentIconUrl = 'https://www.yanda123.com/app/message.png';
    } else if (index == '2') {
      videoIconUrl = 'https://www.yanda123.com/app/live.png';
      commentIconUrl = 'https://www.yanda123.com/app/message-select.png';
    }
    this.setData({
      selected: index,
      videoIconUrl: videoIconUrl,
      commentIconUrl: commentIconUrl
    });
  },

  /**
   * 点击开通VIP
   */
  toVipPage() {
    let that = this;
    if (that.data.userInfo) {
      wx.navigateTo({
        url: '/pages/user/vip/vip',
        success: function() {
          that.pause();
        }
      });
    } else {
      utils.quickTip('请先登录');
    }
  },

  /**
   * 点击改变隐藏简介显示的状态
   */
  toggleHideIntro() {
    let data = 'videoData.showVideoHiddenIntro';
    this.setData({
      [data]: this.data.videoData.showVideoHiddenIntro === '0' ? '1' : '0'
    });
  },

  /**
   * 点击更换播放的集数
   */
  togglePlay(e) {
    commentStore.init(this.data.userInfo);
    this.loadEpisode(e.currentTarget.dataset.index);
  },
  /**
   * 点击改变 全部集数的组件 的显示状态
   */
  toggleHideEpisode(e) {
    let data = 'videoData.showHideEpisode';
    this.setData({
      [data]: this.data.videoData.showHideEpisode === '0' ? '1' : '0'
    });
  },
  /**
   * 点击改变 评论 的过滤条件
   */
  toggleCommentFilter(e) {
    let data = 'commentData.criteria';
    this.setData({
      [data]: e.currentTarget.dataset.index
    });
    this.loadFatherComments(REFRESH);
  },

  toggleModelInput() {
    if (this.data.userInfo) {
      let data = 'commentData.modelInput';
      if (this.data.commentData.modelInput === '1') {
        this.setData({
          textAreaFocus: false
        });
        // 需要先将软键盘收起，再隐藏模态框，如不延时操作，则会导致页面样式错乱
        setTimeout(() => {
          this.setData({
            [data]: '0'
          });
        }, 500);
      } else {
        this.setData({
          [data]: '1',
          textAreaFocus: true
        });
        this.pause();       // 弹出评论 暂停播放
      }
    } else {
      utils.quickTip('请先登录');
    }

  },

  /**
   * 获取用户输入的评论内容
   */
  enterComment(e) {
    let data = 'commentData.commentContent';
    this.setData({
      [data]: e.detail.value
    });
  },

  /**
   * 提交评论，此处将换行符统一替换为逗号再提交
   */
  commitComment() {
    let userInfo = this.data.userInfo;
    let data = this.data.commentData.commentContent,
      parentId = '';
    data = utils.formatLine(data);
    data = utils.trim(data);
    if (this.data.commentData.modelChildComment === '1') {  // 表示是在父评论下评论
      parentId = commentStore.dispatch('getParentId') || '';
    }
    if (data !== '') {
      let commentInfo = {
        commentContent: data,     // 评论内容
        userId: userInfo.userId,               // 用户id
        nickName: userInfo.nickName,
        avatar: userInfo.avatar,
        parentId: parentId,
        episodeId: this.data.videoData.video.episodeId      // 视频id
      }
      $.post({
        url: api.CommentSave,
        header: { "Content-Type": "application/json" },
        data: commentInfo
      }).then((res) => {
        if (res.data.status === 200) {
          this.toggleModelInput();
          if (parentId) {
            this.loadChildComments(parentId, REFRESH);  //如果是在父评论下评论，要刷新子评论
          }
          this.loadFatherComments(REFRESH);   // 评论完刷新父评论数据
        }
      }).catch((err) => {
        console.log(err);
      });
    } else {
      utils.quickTip('请输入评论内容');
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    commentStore.init(userInfo);
    let progress = options.progress ? parseInt(options.progress/1000) : 0;
    // 初始化从页面传递过来的视频id
    this.setData({
      mvId: options.id || 1,
      userInfo: userInfo,
      initialTime: progress,
      videoContext: wx.createVideoContext('myVideo')   // 获取控制视频的对象，操作组件内 <video/> 组件
    });
    this.getEpisodeList(this.data.mvId, options.episodeId);
    // 音频事件监听
    this.audioListener(progress);
  },

  /**
   * 加载父评论数据
   * @param refresh: 代表是否刷新评论 '1' 代表刷新，其他代表加载更多
   */
  loadFatherComments(refresh) {
    commentStore.dispatch('loadFatherComments',
      { episodeId: this.data.videoData.video.episodeId, criteria: this.data.commentData.criteria, refresh: refresh })
      .then((res) => {
        if (res.status === 200) {
          this.setData({
            [_commentList]: res.data.commentList
          });
        }
      }).catch((err) => {
        console.log(err);
      });
  },

  toggleModelChild(e) {
    let index = e.currentTarget.dataset.index,
      mcd = this.data.commentData.modelChildComment,
      _mcd = 'commentData.modelChildComment',
      _pc = 'commentData.parentComment';
    if (index !== undefined) {
      let pc = this.data.commentData.commentList[index];
      this.setData({ [_pc]: pc });
      this.loadChildComments(pc.commentId);
    }
    this.setData({
      [_mcd]: mcd === '1' ? '0' : '1'
    });
  },

  /**
   * 加载子评论事件
   */
  loadChildComments(parentId, refresh) {
    commentStore.dispatch('loadChildComments', {
      parentId: parentId,
      refresh: refresh,
      episodeId: this.data.videoData.video.episodeId
    }).then((res) => {
      if (res.status === 200) {
        this.setData({
          childComments: res.data.childComments
        });
      }
    }).catch((err) => {
      console.log(err);
    })
  },

  /**
   * 点赞事件，子组件触发
   */
  agreeChange(e) {
    if (this.data.userInfo) {
      let commentId = e.detail.commentId;
      commentStore.dispatch('toggleAgree', { commentId: commentId, episodeId: this.data.videoData.video.episodeId, userId: this.data.userInfo.userId });
    }

  },


  /**
   * 获取当前视频下的视频集列表
   */
  getEpisodeList(mvId, episodeId) {
    $.get({
      url: api.EpisodeList + mvId
    }).then((res) => {
      this.setData({
        episodeList: res.data     
      });
      if(episodeId) {
        this.loadEpisode(episodeId);  
      } else {
        this.setData({
          currentEpisode: res.data[0]
        });
        this.loadEpisode(this.data.currentEpisode.episodeId);
      }
    });
  },

  /**
   * 点击不同集数获取对应的视频集信息
   */
  loadEpisode(episodeId) {
    $.get({
      url: api.EpisodeDetail + episodeId
    }).then((res) => {
      let episodeInfo = res.data;
      if (episodeInfo) {
        episodeInfo.imgSrc = 'https://www.yanda123.com/yanda/attach/readFile?size=800&id=' + episodeInfo.imgAppendixId;
        let currentEpisode = {
          episodeId: episodeId,
          episodeNum: episodeInfo.episodeInfo
        };
        let mvType = episodeInfo.type;
        this.setData({
          [_video]: episodeInfo,
          currentEpisode: currentEpisode,
          mvType: mvType
        });
        if (episodeInfo.vipType == 1) {
          let vipCard = this.data.userInfo.vipCard;
          if (!vipCard) {
            this.setData({
              tip: '该视频需要vip方可观看'
            });
            this.pause();
            return;
          } else {
            let expTime = new Date(vipCard.expTime).getTime();
            let nowTime = new Date().getTime();
            if (expTime <= nowTime) {
              this.setData({
                tip: '您的会员已到期，无法观看vip视频'
              });
              this.pause();
              return;
            }
          }
        }

        //对于VIP视频，先验证当前用户会员权限再初始化视频地址
        this.setData({
          tip: ''
        });
        episodeInfo.mvSrc = utils.getAttachSrc(episodeInfo.mvAttach);
        this.setData({
          [_video]: episodeInfo
        });

        if (mvType == 2) {
          // 音频播放
          app.backgroundAudioManager.title = episodeInfo.episodeName;
          app.backgroundAudioManager.coverImgUrl = episodeInfo.imgSrc;
          app.backgroundAudioManager.src = episodeInfo.mvSrc;
          let duration = Math.floor(episodeInfo.duration / 1000);
          console.log('音频时长：' + duration);
          this.setData({
            duration: Math.floor(episodeInfo.duration/1000)
          })
        } 
        if (this.data.userInfo && this.data.userInfo.userId) {
          let self = this;
          commentStore.dispatch('loadUserAgrees', self.data.videoData.video.episodeId).then((res) => {
            self.loadFatherComments(REFRESH);
          }).catch((err) => {
            console.log(err);
          });
        } else {
          this.loadFatherComments(REFRESH);
        }
      }
    }).catch((err) => {
      console.log(err);
    });
  },

  loadHistoryRecord() {
    $.post({
      url: api.HistoryRecord,
      data: {
        userId: this.data.userInfo.userId,
        episodeId: this.data.videoData.video.episodeId
      }
    }).then((res)=> {
      if(res.data.status === 200) {
        let userHistoryInfo = res.data.data;
        this.setData({
          initialTime: userHistoryInfo.progress || 0
        })
      }
    }).catch((err)=> {
      console.log(err);
    })    
  },

  /**
   * 播放上一首
   */
  playPre: function () {
    let that = this;
    let list = that.data.episodeList;
    let index = that.data.currentEpisode.episodeId;
    for (let i = 0; i < list.length; i++) {
      if (list[i].episodeId == index) {
        commentStore.init(that.data.userInfo);
        if (i != 0) {
          that.loadEpisode(list[i - 1].episodeId);
        } else {
          that.loadEpisode(list[list.length - 1].episodeId);
        }
      }
    }
  },
  /**
   * 播放下一首
   */
  playNext: function () {
    let that = this;
    let list = that.data.episodeList;
    let index = that.data.currentEpisode.episodeId;
    for (let i = 0; i < list.length; i++) {
      if (list[i].episodeId == index) {
        commentStore.init(that.data.userInfo);
        if (i != (list.length - 1)) {
          that.loadEpisode(list[i + 1].episodeId);
        } else {
          that.loadEpisode(list[0].episodeId);
        }
      }
    }
  },

  // 播放模式
  playTypeChange(e) {
    let type = this.data.playType;
    if (type == 1) {
      this.setData({
        playType: 2,
        playTypeText: '单曲循环'
      });
    } else {
      this.setData({
        playType: 1,
        playTypeText: '顺序播放'
      });
    }
  },

  videoTimeUpdate(e) {
    this.setData({
      currentPlayTime: e.detail.currentTime
    })
  },

  /**
   * 增加收藏
   */
  addCollect() {
    if(this.data.userInfo && this.data.userInfo.userId) {
      $.post({
        url: api.CollectAdd,
        data: {
          userId: this.data.userInfo.userId,
          episodeId: this.data.videoData.video.episodeId
        }
      }).then((res)=> {
        utils.quickTip(res.data.message);
      }).catch((err)=> {
        utils.quickTip('网络错误, 请稍后再试'); 
      })
    } else {
      utils.quickTip('请先登录');
    }
  },
  /**
   * 音乐播放器事件监听
   */
  audioListener: function (lastProcess) {
    var that = this;
    //背景音频播放进度更新事件
    app.backgroundAudioManager.onTimeUpdate(function (callback) {
      let currentTime = app.backgroundAudioManager.currentTime;
      let duration = app.backgroundAudioManager.duration;
      let progress = parseInt((currentTime / duration) * 100);
      that.setData({
        progress: progress,
        currentProcess: utils.secondsToTime(currentTime),
        totalProcess: utils.secondsToTime(duration),
        currentPlayTime: currentTime,
        initialTime: currentTime
      });
      
    });
    //背景音频自然播放结束事件
    app.backgroundAudioManager.onEnded(function (callback) {
      that.setData({
        progress: 0
      });
      console.log('监听到音乐结束，播放下一首');
      let type = that.data.playType;
      if (type == 2) {
        let episodeId = that.data.currentEpisode.episodeId;
        that.loadEpisode(episodeId);
      } else {
        that.playNext();
      }
    });

    //背景音频播放事件
    app.backgroundAudioManager.onPlay(function (callback) {
       console.log('music play');
       if (lastProcess) {
         that.seekCurrentAudio(lastProcess);
       }
    });

    //背景音频即将开始播放事件
    app.backgroundAudioManager.onCanplay(function (callback) {
      // 貌似无法触发该监听
    });

    app.backgroundAudioManager.onPause(()=> {
      
    });

    //IOS在系统面板播放上一首
    app.backgroundAudioManager.onPrev(function (callback) {
      that.playPre();
    });

    //IOS在系统面板播放下一首
    app.backgroundAudioManager.onNext(function (callback) {
      that.playNext();
    });

  },
  /**
   * 播放
   */
  play: function () {
    if(this.data.mvType === 1) {
      this.data.videoContext.play();
    } else {
      app.backgroundAudioManager.play();
    }
    
  },

  /**
    * 暂停
    */
  pause: function () {
    if(this.data.mvType === 1) {
      this.data.videoContext.pause();
    } else {
      app.backgroundAudioManager.pause();
    }
  },

  /**
   * 音乐快进或后退
   */
  hanleSliderChange: function (e) {
    const position = e.detail.value;
    this.seekCurrentAudio(position);
  },

  // 拖动进度条控件
  seekCurrentAudio(position) {
    // 更新进度条
    const that = this;
    // 音频控制跳转
    // 这里有一个诡异bug：seek在暂停状态下无法改变currentTime，需要先play后pause
    const pauseStatusWhenSlide = app.backgroundAudioManager.paused;
    if (pauseStatusWhenSlide) {
      app.backgroundAudioManager.play();
    }
    app.backgroundAudioManager.seek(Math.floor(position));
    if (pauseStatusWhenSlide) {
      app.backgroundAudioManager.pause();
    };
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
   * 客户离开页面时先判断客户有没有点赞，若有点赞再统一请求点赞接口
   */
  onUnload: function () {
    this.pause();     // 避免退出页面 音频还在播放
    if(this.data.userInfo && this.data.userInfo.userId) {
      let progress = parseInt(this.data.currentPlayTime) * 1000;
      $.post({
        url: api.HistoryUpsert,
        data: {
          userId: this.data.userInfo.userId,
          episodeId: this.data.videoData.video.episodeId,
          progress: progress
        }
      }).then((res)=> {

      }).catch((err)=> {

      });
    }
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
}))