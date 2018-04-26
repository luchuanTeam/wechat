/**
 * 用于存储 video 页面的 视频信息
 */

const $ =require('../utils/ajax.js');
/**
 * 返回结果
 */
const RESULT = function(status, message, data) {
  this.status = status;
  this.message = message;
  this.data = data || {};
}

/**
 * 起始数据
 */
const INIT = function() {
  this.user = {
    userId: 1,
    userName: '樱木花道',
    avatar: '../../../resources/images/fenlei.png'  
  };
  this.commentList = [];      // 视频的直接评论列表
  this.parentComment = {};    // 显示子评论时用于保存对应的父评论
  this.childComments = {};    // 保存所加载过得子评论集合 key值是父评论的ID，value是object对象，其中的comments 是对应的子评论列表
  this.pageNum = 1;
  this.pageSize = 3;
  this.canLoadMore = '1';       // 1 代表可加载更多评论 0 代表不能加载更多
  this.currentChildComment = {};  //当前的子评论
  this.evilAgree = false;        // 频繁点赞
  this.agreeChangeObj = {};
  this.startTime = '';         // 点赞的起始时间
  this.hasAgrees = [];        // 已经点赞过的评论
}

/**
 * privateState
 * 内部私有变量
 */
let privateState;


/**
 * privateActions
 * 内部私有方法
 */
const privateActions = {
  /**
   * 加载评论
   * @param: obj.pageNum: 页码数 必填
   * @param: obj.pageSize: 页面条目, 必填
   * @param: obj.episodeId: 视频Id, 必填
   */
  loadComments(obj) {
    return new Promise((resolve, reject) => {
      $.get({
        url: 'https://www.yanda123.com/yanda/comment/list',
        data: {
          pageNum: obj.pageNum,
          pageSize: obj.pageSize,
          episodeId: obj.episodeId,
          criteria: obj.criteria || 1,
          parentId: obj.parentId || 0
        }
      }).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    })
  },
  /**
   * 组合父评论列表
   * @param data.list 加载到的评论列表
   * @param data.total 总评论条目
   * @param data.refresh 1代表刷新数据, 如果刷新，则 privateState.commentList 要清空
   */
  groupCommentList(data) {
    let commentList = privateState.commentList,
        list = data.list,
        total = data.total,
        refresh = data.refresh;
    refresh === 1 && (commentList = []);
    privateState.pageNum * privateState.pageSize < total ? privateState.pageNum++ : privateState.canLoadMore = '0';
    for (let i = 0; i < list.length; i++) {
      list[i].userName = privateState.user.userName;
      list[i].avatar = privateState.user.avatar;
      for (let j = 0, hasAgrees = privateState.hasAgrees; j < hasAgrees.length; j++) {
        if(list[i].commentId === hasAgrees[j].commentId) {
          list[i].hasAgree = 1;
          break;
        }
      }
      commentList.push(list[i]);
    }
    privateState.commentList = commentList;
    return new RESULT(200,'success', {
      commentList: privateState.commentList,
      canLoadMore: privateState.canLoadMore
    });
  },
  /**
   * 组合子评论列表
   */
  groupChildComments(obj) {
    let childComments = privateState.childComments,
        childComment = obj.childComment,
        list = obj.list,
        parentId = childComment.parentId;
    childComment.pageNum * childComment.pageSize > childComment.total ? childComment.canLoadMore = '0' : childComment.pageNum++;

    for (let i = 0; i < list.length; i++) {
      list[i].userName = privateState.user.userName;
      list[i].avatar = privateState.user.avatar;
      childComment.comments.push(list[i]);
    }
    childComments[parentId] = childComment;
    privateState.childComments = childComments;
    privateState.currentChildComment = childComment;
    return privateState.childComments;
  },

  /**
   * 发送点赞或取消点赞请求
   * @param obj.userId 点赞用户Id
   * @param obj.commentId 点赞评论的Id
   * @param obj.episodeId 对应的视频Id
   */
  toggleAgreeCount(obj) {
    return new Promise((resolve, reject)=> {
      $.post({
        url: 'https://www.yanda123.com/yanda/comment/toggleAgreeCount',
        data: {
          userId: obj.userId,
          commentId: obj.commentId,
          episodeId: obj.episodeId
        }
      }).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    })
  },

  /**
   * 获取用户在某一视频下所有点赞过的评论记录
   * @param userId 用户ID
   * @param episodeId 视频ID
   */
  listUserAgrees(userId, episodeId) {
    return new Promise((resolve, reject)=> {
      $.get({
        url: 'https://www.yanda123.com/yanda/userAgree/list',
        data: {
          userId: userId,
          episodeId: episodeId
        }
      }).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  }

}

const actions = {
  /**
   *  存储用户信息
   */
  setUser(user) {
    privateState.user = user;     
  },

  /**
   * 获取当前子评论的父评论Id
   */
  getParentId() {
    return privateState.currentChildComment.parentId;
  },
  /**
   * 加载父评论
   * @param obj.episodeId : 视频Id, 根据ID 获取对应的父评论列表，必填
   * @param obj.criteria : 视频排序规则 1 最新，2 时间顺序，3 赞同次数 非必填
   * @param obj.refresh　: 1 代表刷新评论， 其他代表加载更多评论
   */
  loadFatherComments(obj) {
    let episodeId = obj.episodeId, 
        criteria = obj.criteria, 
        refresh = obj.refresh;
    if(!episodeId || isNaN(parseInt(episodeId)) || parseInt(episodeId) <= 0) {
      return new Promise((resolve, reject)=> {
        reject(new RESULT(-1, 'episodeId 传参错误'));
      }) 
    }
    if (privateState.canLoadMore === '1' || refresh === 1) {
      refresh === 1 && (privateState.pageNum = 1, privateState.canLoadMore = '1');
      return new Promise((resolve, reject)=> {
        privateActions.loadComments({
          pageNum: privateState.pageNum,
          pageSize: privateState.pageSize,
          episodeId: episodeId,
          criteria: criteria
        }).then((res) => {
          let result = privateActions.groupCommentList({
            list: res.data.data.list,
            refresh: refresh,
            total: res.data.data.total
          });
          resolve(result);
        }).catch((err) => {
          reject(err);
        });
      }) 
    } else {
      return new Promise((resolve)=> {
        resolve(new RESULT(100, '数据加载完毕', {
          commentList: privateState.commentList,
          canLoadMore: privateState.canLoadMore
        }));
      })
    }
  },

  /**
   * 加载子评论
   */
  loadChildComments(obj) {
    let parentId = obj.parentId,
        refresh = obj.refresh,
        episodeId = obj.episodeId,
        childComment;
    if ((typeof parentId === 'number' && !privateState.childComments[parentId]) || refresh === 1 ) {  // 首次加载或者是刷新子评论
      childComment = { pageNum: 1, pageSize: 3, canLoadMore: '1', comments: [], total: 0, parentId: parentId };
    } else if (typeof parentId === 'number' && privateState.childComments[parentId]) { //之前已经加载过,直接返回缓存数据
      privateState.currentChildComment = privateState.childComments[parentId];
      return new Promise((resolve, reject)=> {
        resolve(new RESULT(304, 'success'));
      })
    } else {    // 其他情况则是加载更多评论情况
      parentId = privateState.currentChildComment.parentId;
      childComment = privateState.childComments[parentId];
    }

    if(childComment && childComment.canLoadMore === '1') {
      return new Promise((resolve, reject)=> {
        privateActions.loadComments({
          pageNum: childComment.pageNum,
          pageSize: childComment.pageSize,
          parentId: childComment.parentId,
          episodeId: episodeId
        }).then((res) => {
          if (res.data.status === 200) {
            childComment.total = res.data.data.total;
            let childComments = privateActions.groupChildComments({
              childComment: childComment,
              list: res.data.data.list
            });
            resolve(new RESULT(200, 'success', {
              childComments: childComments
            }));
          }
        }).catch((err) => {
          reject(err);
        });
      })
    } else {
      return new Promise((resolve)=> {
        resolve(new RESULT(100, '没有更多数据了'));
      })
    }
  },

  /**
   * 点赞事件
   * @param obj.commentId 点赞的评论Id
   * @param obj.flag 标记 1 代表点赞，其他（默认为0）代表取消点赞
   */
  toggleAgree(obj) {
    let commentId = obj.commentId, episodeId = obj.episodeId;
    privateState.agreeChangeObj[commentId] ? privateState.agreeChangeObj[commentId]++ : privateState.agreeChangeObj[commentId] = 1;
    // 获取现在点赞的时间，上一次点赞的时间
    let now = new Date(), lastTime = privateState.startTime;
    privateState.startTime = now;
    if (now - lastTime < 10 * 1000) {
      if (privateState.agreeChangeObj[commentId] > 2 || privateState.evilAgree) {   // 频繁点赞
        privateState.evilAgree = true;
        return;
      }
    }      
    // 间隔超过10秒, 直接发送请求
    privateState.evilAgree = false;
    let self = this;
    return new Promise((resolve, reject)=> {
      privateActions.toggleAgreeCount({
        userId: 1,
        commentId: commentId,
        episodeId: episodeId
      }).then((res) => {
        self.loadUserAgrees(episodeId);   //点赞完后要重新获取点赞过的记录
      }).catch((err) => {
        reject(err);
      });
    })
  },

  /**
   * 加载用户在该视频下已点赞过的评论 
   * @param episodeId 视频Id
   */
  loadUserAgrees(episodeId) {
    let userId = privateState.user.userId;
    return new Promise((resolve, reject)=> {
      privateActions.listUserAgrees(userId, episodeId).then((res) => {
        if (res.data.status === 200) {
          privateState.hasAgrees = res.data.data.list;
          resolve(res);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

const dispatch = (actionName, obj)=> {
  if(actions[actionName]) {
    return (actions[actionName])(obj);
  } else {
    return new Promise((resolve, reject)=> {
      reject(new RESULT(-1, '无此方法'));
    });
  }
}

/**
 * 初始化数据
 */
const init = function() {
  privateState = new INIT();
}

module.exports = {
  dispatch: dispatch,
  init: init
}