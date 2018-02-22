Component({
  properties: {
    details: {
      type: Object
    }
  },
  data: {

  },
  methods: {
    showVideoPage() {
      wx.navigateTo({
        url: '../video/video',
      })
    }
  }
})