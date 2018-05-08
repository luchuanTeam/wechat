var slide = {},
  start = {};
Component({
  /**
   * 组件的属性列表
   */
  properties: {
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
      start = {   // 记录当前按下的位置
        x: e.touches[0].pageX,
        y: e.touches[0].pageY
      }
      this.triggerEvent('pressStart', { sliderId: this.properties.sliderId})
    },

    touchMove(e) {
      slide = {
        x: e.touches[0].pageX - start.x,
        y: e.touches[0].pageY - start.y
      }
    },

    touchEnd(e) {
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
    },

    deleteSlider() {
      this.setData({
        deleted: true
      })
    },
    
    init() {
      this.setData({
        hideContentClass: '',
        showDeleteClass: ''
      })
    }
  }
})
