import Toast from 'tdesign-miniprogram/toast';
Page({
  data: {
    nameValue: '',
  },
  onLoad(options) {
    const {
      phone
    } = options;
    this.setData({
      phoneValue: phone,
    });
  },
  onSubmit() {
    let that = this
    let app = getApp()
    wx.request({
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      url: app.globalData.URL + "/user/editPhone",
      data: {
        token: app.globalData.session_key,
        phone: that.data.phoneValue
      },
      success: (res) => {
        console.log(res)
        if (res.data.code == "success") {
          //修改成功
          Toast({
            context: that,
            selector: '#edit-t-toast',
            message: '修改成功',
            theme: 'success',
          });
          wx.navigateBack({
            backRefresh: true
          });
        }
      }

    })
  },
  clearContent() {
    this.setData({
      nameValue: '',
    });
  },
});