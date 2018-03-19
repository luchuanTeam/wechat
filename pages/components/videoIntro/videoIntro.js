// pages/components/videoImg/videoImg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    videoIntro: {
      type: Object,
      value: {
      	mvId: '',
        imgUrl: '',
        mvName: '',
        classifyName: ''
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
		toVideoPage() {
			wx.navigateTo({
      	url: '../video/video?id=' + this.properties.videoIntro.mvId,
    	});
		}
  }
})
