// pages/payment/payment.js
import Toast from 'tdesign-miniprogram/toast/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    transactionID: "",
    commodityID: 0,
    coverUrl: "",
    place: "",
    sellerID: 0,
    state: 1,
    timeExcepted: "",
    title: "",
    transTime: "",
    type: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '确认付款',
    })
    let transactionID = parseInt(options.transactionID)
    this.setData({
      transactionID: transactionID,
    })
    this.loadTrans()
  },
  loadTrans() {
    let app = getApp()
    let that = this
    wx.request({
      url: app.globalData.URL + '/trans/detail',
      method: "POST",
      timeout: 500,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: app.globalData.session_key,
        transactionID: this.data.transactionID
      },
      success: (res) => {
        console.log("loadTrans", res.data)
        that.setData(res.data)
        console.log("loadTrans done", that.data)
      }

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  pay() {
    let app = getApp()
    let that = this
    wx.request({
      url: app.globalData.URL + '/trans/pay',
      method: "POST",
      timeout: 500,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: app.globalData.session_key,
        transId: that.data.transactionID
      },
      success: (res) => {
        console.log("pay", res.data.code)
        if (res.data.code == "success") {
          console.log("pay success")
          Toast({
            context: this,
            selector: '#pay-t-toast',
            message: "支付成功",
            theme: 'success',
          });
          wx.navigateBack()
        } else if (res.data.code == 'fail') {
          console.log("pay fail")
          Toast({
            context: this,
            selector: '#pay-t-toast',
            message: "支付失败",
            theme: 'fail',
          });
        } else {
          Toast({
            context: this,
            selector: '#pay-t-toast',
            message: res.data.code,
            theme: 'fail',
          });
        }

      }
    })
  },
  cancel() {
    let app = getApp()
    let that = this
    wx.request({
      url: app.globalData.URL + '/trans/cancel',
      method: "POST",
      timeout: 500,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: app.globalData.session_key,
        transId: that.data.transactionID
      },
      success: (res) => {
        console.log("cancel", res.data.code)
        if (res.data.code == 'success') {
          Toast({
            context: this,
            selector: '#pay-t-toast',
            message: "取消成功",
            theme: 'success',
          });
          wx.navigateBack()
        } else {
          Toast({
            context: this,
            selector: '#pay-t-toast',
            message: "取消失败",
            theme: 'fail',
          });
        }
      }
    })

  }
})