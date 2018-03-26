/**
 * 用于存储 video 页面的 视频信息
 */

const $ =require('../utils/ajax.js');
const RESULT = function(status, message, data) {
  this.status = status;
  this.message = message;
  this.data = data || {};
}


/**
 * privateState
 * 内部私有变量
 */
const privateState = {
  user: {
    userName: '樱木花道',
    avatar: '../../../resources/images/fenlei.png'
  },       // 用户信息
  pageNum: 1,
  pageSize: 3,
  canLoadMore: '1',       // 1 代表可加载更多评论 0 代表不能加载更多
  currentChildComment: {}
}

/**
 * state: 存储数据
 */

const state = { 
  commentList: [],      // 用于存储视频的所有父评论
  parentComment: {},    // 用于存储父评论，当要获取某一评论的所有子评论时，用该对象存储点击的父评论
  childComments: {}
};


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
   * @param data.refresh 1代表刷新数据, 如果刷新，则 state.commentList 要清空
   */
  groupCommentList(data) {
    let commentList = state.commentList,
        list = data.list,
        total = data.total,
        refresh = data.refresh;
    refresh === 1 && (commentList = []);
    privateState.pageNum * privateState.pageSize < total ? privateState.pageNum++ : privateState.canLoadMore = '0';
    for (let i = 0; i < list.length; i++) {
      list[i].userName = privateState.user.userName,
      list[i].avatar = privateState.user.avatar,
      commentList.push(list[i]);
    }
    state.commentList = commentList;
    return new RESULT(200,'success', {
      commentList: state.commentList,
      canLoadMore: privateState.canLoadMore
    });
  },
  /**
   * 组合子评论列表
   */
  groupChildComments(obj) {
    let childComments = state.childComments,
        childComment = obj.childComment,
        list = obj.list,
        parentId = childComment.parentId;
    childComment.pageNum * childComment.pageSize > childComment.total ? childComment.canLoadMore = '0' : childComment.pageNum++;

    for (let i = 0; i < list.length; i++) {
      list[i].userName = privateState.user.userName,
      list[i].avatar = privateState.user.avatar,
      childComment.comments.push(list[i]);
    }
    childComments[parentId] = childComment;
    state.childComments = childComments;
    privateState.currentChildComment = childComment;
    return state.childComments;
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
          commentList: state.commentList,
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
    if((typeof parentId === 'number' && !state.childComments[parentId]) || refresh === 1 ) {  // 首次加载或者是刷新子评论
      childComment = { pageNum: 1, pageSize: 3, canLoadMore: '1', comments: [], total: 0, parentId: parentId };
    } else if (typeof parentId === 'number' && state.childComments[parentId]) { //之前已经加载过,直接返回缓存数据
      privateState.currentChildComment = state.childComments[parentId];
      return new Promise((resolve, reject)=> {
        resolve(new RESULT(304, 'success'));
      })
    } else {    // 其他情况则是加载更多评论情况
      parentId = privateState.currentChildComment.parentId;
      childComment = state.childComments[parentId];
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

module.exports = {
  state: state,
  dispatch: dispatch
}