import TabMenu from './data';
Component({
  data: {
    active: 0,
    list: TabMenu,
    theme: {
      custom: {
        colorPrimary: '#333',
      },
    },
  },

  methods: {
    onChange(event) {
      this.setData({
        active: event.detail.value
      });
      if (this.data.list[event.detail.value].url != 'publish') {
        wx.switchTab({
          url: this.data.list[event.detail.value].url.startsWith('/') ?
            this.data.list[event.detail.value].url : `/${this.data.list[event.detail.value].url}`,
        });
        this.setData({
          isShown: false
        })
      } else {
        console.log("open publish dialog")
        this.setData({
          isShown: true
        })
      }

    },

    init() {
      const page = getCurrentPages().pop();
      const route = page ? page.route.split('?')[0] : '';
      const active = this.data.list.findIndex(
        (item) =>
        (item.url.startsWith('/') ? item.url.substr(1) : item.url) ===
        `${route}`,
      );
      this.setData({
        active
      });
    },
  },
});