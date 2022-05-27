// pages/comment.js
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
    rateValue: 5,
    commentDone: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '评价',
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
  changeValue(e) {
    this.setData({
      rateValue: e.detail.value
    })
  },
  commit() {
    let app = getApp()
    let that = this
    console.log("commit", this.data.rateValue)
    wx.request({
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      url: app.globalData.URL + "/trans/rate",
      data: {
        token: app.globalData.session_key,
        transId: that.data.transactionID,
        rate: that.data.rateValue
      },
      success: (res) => {
        if (res.data.code == 'success') {
          wx.navigateBack()
        }
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

  }
})