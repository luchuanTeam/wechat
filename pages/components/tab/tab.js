Component({
  properties: {
    activeTab: {
      type: Number,
      value: 0
    }
  },
  data: {
    menus: ['注册', '登录', '扫一扫', '升级VIP', '推荐']
  },
  methods: {
    menuTap(e) {
      let index = e.currentTarget.dataset.index; //获取点击菜单的下标
      this.triggerEvent('tabchange', {index:index});
    }
  }
})