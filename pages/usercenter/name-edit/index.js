import Toast from 'tdesign-miniprogram/toast/index';
Page({
  data: {
    nameValue: '',
  },
  onLoad(options) {
    const {
      name
    } = options;
    this.setData({
      nameValue: name,
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
      url: app.globalData.URL + "/user/editName",
      data: {
        token: app.globalData.session_key,
        name: that.data.nameValue
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
          wx.tim.updateMyProfile({
            nick: res.data.name,
          }).then(function (imResponse) {
            console.log("更新资料成功", imResponse.data); // 
          })
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