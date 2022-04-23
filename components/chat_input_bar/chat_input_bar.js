// components/chat_input_bar/chat_input_bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    extra_visible: false,
    textMessage: "",
    tools: [{
        icon: "image",
        text: "照片",
      },
      {
        icon: "photo",
        text: "拍摄"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    extra_show() {
      console.log("extra show");
      this.setData({
        extra_visible: true
      });
    },
    onVisibleChange({
      detail
    }) {
      const {
        visible
      } = detail;
      this.setData({
        extra_visible: visible
      });
    },
  }
})