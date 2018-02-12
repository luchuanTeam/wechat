
const POEM = 0,   //唐诗
      MANNER = 1, //日常礼仪
      CHILDRENL = 2,  // 幼儿语文 
      PRIMARYL = 3,   // 小学语文
      MIDDLEL = 4;    // 中学语文
let _details = {
  title: '唐诗',
  data: [
    {
      imgUrl: 'http://www.yanda123.com/images/1518273153583.jpg',
      title: '我是陈大牛',
      introduce: '我是陈立，人称陈大牛，月薪12K，我就想问一句妈的还有谁?哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈'
    },
    {
      imgUrl: 'http://www.yanda123.com/images/1518273153583.jpg',
      title: '我是陈大牛',
      introduce: '我是陈立，人称陈大牛，月薪12K，我就想问一句妈的还有谁?'
    },
    {
      imgUrl: 'http://www.yanda123.com/images/1518273153583.jpg',
      title: '我是陈大牛',
      introduce: '我是陈立，人称陈大牛，月薪12K，我就想问一句妈的还有谁?'
    },
    {
      imgUrl: 'http://www.yanda123.com/images/1518273153583.jpg',
      title: '我是陈大牛',
      introduce: '我是陈立，人称陈大牛，月薪12K，我就想问一句妈的还有谁?'
    }
  ]
};      
let obj = {
  imgUrl: 'http://www.yanda123.com/images/1518273153583.jpg',
  title: '我是陈大牛',
  introduce: '我是陈立，人称陈大牛，月薪12K，我就想问一句妈的还有谁?'  
};


Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: POEM,
    title: "主页",
    imgUrls: [],
    details: {    // 详细界面的数据
      title: '',    // 标题
      data: [    // 具体数据
        {
          imgUrl: '',   //图片地址
          title: '',   //标题
          introduce: ''   //介绍
        }
      ]   
    },
    loadingShow: '1',
    getNewData: 0
  },

  activeTabChange(e) {
    
    this.setData({
      activeTab: e.detail.index,
      title: "主页君，你好"
    });
    /* 以下方法应为调用后端接口， 根据点击的菜单栏传对应的参数值，获取相对应的数据 */

    if(e.detail.index === 0) {
      this.setData({
        details: {
          title: '唐诗',
          data: _details.data
        }
      })
    } else if(e.detail.index === 1) {
      this.setData({
        details: {
          title: '日常礼仪',
          data: _details.data
        }
      });  
    } else {
      this.setData({
        details: {
          title: '其他',
          data: _details.data
        }
      });    
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: "http://www.yanda123.com/yanda/banner/list",
      data: {pageNum: 1, pageSize: 4},
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.data.status == 200) {
          var data = res.data.data.list;
          var urlArr = [];
          for (var i = 0; i < data.length; i++) {
            urlArr.push(data[i].imgUrl);
          }
          that.setData({
            imgUrls: urlArr
          });
        }
      },
      fail: function (err) {
        console.log(err)
      }
    });
    /* 此处还应加一个方法，获取 唐诗 对应的数据 */
    
    this.setData({
      details: _details
    })
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
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function (e) {
    console.dir(e); 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    if(this.data.getNewData < 5) {
      _details.data.push(obj);
      setTimeout(() => {
        this.data.getNewData++;
        this.setData({
          details: _details
        });
        if (this.data.getNewData >= 5){
          this.setData({
            loadingShow: '0'
          })
        }
      }, 1000);
      
    } 
    
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})