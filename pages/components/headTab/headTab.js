Component({
  
  properties: {
    activeTab: {
      type: Number,
      value: 0
    }
  },

  data: {
    menuList: ['唐诗', '日常礼仪', '幼儿语文', '小学语文', '初中语文']  
  },

  methods: {
    menuTap(e) {
      let index = e.currentTarget.dataset.index; //获取点击菜单的下标
      this.triggerEvent('tabchange', { index: index });
    }
  }
})