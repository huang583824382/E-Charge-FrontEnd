// pages/admin/admin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: 'Admin Space'
    });
  },

  init() {
    let app = getApp()
    let that = this
    wx.request({
      url: app.globalData.URL + '/admin/list',
      method: "POST",
      timeout: 500,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        "token": app.globalData.session_key,
      },
      success: (res) => {
        console.log("get admin list", res.data)
        that.setData(res.data)
      }
    })
  },

  getReview() {
    wx.navigateTo({
      url: '/pages/admin/review/review',
    })
  },

  getReport() {
    wx.navigateTo({
      url: '/pages/admin/report/report',
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
    this.init()
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