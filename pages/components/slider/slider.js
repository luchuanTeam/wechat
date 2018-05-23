var slide = {},
    start = {},
    $ = require('../../../utils/ajax.js'),
    api = require('../../../config/api.js'),
    util = require('../../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    videoInfo: {
      type: Object,
      value: {}
    },
    sliderId: {
      type: Number,
      value: -1
    },
    initSliderId: {
      type: Number,
      observer(newVal, oldVal) {
        if(newVal === this.properties.sliderId) {
          this.init();
        }
      }
    },
    deleteUrl: {
      type: String,
      value: ''
    },
    editState: {
      type: Number,
      value: 0,
      observer(newVal, oldVal) {
        this.toggleSliderStyle(newVal);
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hideContentClass: '',
    showDeleteClass: '',
    deleted: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    touchStart(e) {
      if (this.properties.editState === 0) {
        start = {   // 记录当前按下的位置
          x: e.touches[0].pageX,
          y: e.touches[0].pageY
        }
        this.triggerEvent('pressStart', { sliderId: this.properties.sliderId })
      }
    },

    touchMove(e) {
      if(this.properties.editState === 0) {
        slide = {
          x: e.touches[0].pageX - start.x,
          y: e.touches[0].pageY - start.y
        }
      }
    },

    touchEnd(e) {
      if(this.properties.editState === 0) {
        this.triggerEvent('pressEnd');
        if (slide.x < -50) {
          this.setData({
            hideContentClass: `left: -150rpx`,
            showDeleteClass: `right: 0`
          });
          this.triggerEvent('slideLeft', { sliderId: this.properties.sliderId });
        } else {
          this.init();
        }
        slide = {};
      }
    },

    deleteSlider() {
      if (this.properties.videoInfo.id && this.properties.deleteUrl) {
        $.post({
          url: this.properties.deleteUrl,
          data: {
            id: this.properties.videoInfo.id
          }  
        }).then((res) => {
          if(res.data.status === 200) {
            this.triggerEvent('deleteById', { id: this.properties.sliderId });         
            this.setData({
              deleted: true
            })
          } else {
            util.quickTip('删除失败, 请稍后再试');
          }
        }).catch((err)=> {
          util.quickTip('删除失败, 请稍后再试');   
        })
      }
     
    },
    
    init() {
      this.setData({
        hideContentClass: '',
        showDeleteClass: ''
      })
    },

    toVideoPage() {
      let episodeInfo = this.properties.videoInfo.episodeInfo;
      if(episodeInfo && episodeInfo.mvId && episodeInfo.episodeId) {
        wx.navigateTo({
          url: `../../video/video?id=${episodeInfo.mvId}&episodeId=${episodeInfo.episodeId}`,
        });
      }
    },

    toggleSliderStyle(data) {
      this.setData({
        hideContentClass: data === 1 ? 'left: 60rpx' : '',
        showDeleteClass: ''
      })
    }
  }
})
