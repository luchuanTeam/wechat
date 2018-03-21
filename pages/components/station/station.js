// pages/components/station/station.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    station: {
      type: Object,
      value: {
        id: '',
        imgUrl: '',
        desc: ''
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    stationHandle: function(e) {
      getApp().globalData.selected = this.properties.station.id;
      wx.switchTab({
      	url: '../zone/zone',
    	});
    }
  }
})
