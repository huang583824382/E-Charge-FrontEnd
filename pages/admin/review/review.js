// pages/admin/review/review.js
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
      title: '审核列表'
    });
  },

  init() {
    let app = getApp()
    let that = this
    wx.request({
      url: app.globalData.URL + '/admin/review',
      method: "POST",
      timeout: 500,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        "token": app.globalData.session_key,
      },
      success: (res) => {
        console.log("get review list", res.data)
        that.setData({
          review: res.data.Review,
        })
        console.log(that.data)
      }
    })
  },
  onOrderCardTap(e) {
    console.log("enter detail", e)
    wx.navigateTo({
      url: `/pages/goods/details/index?spuId=${e.currentTarget.dataset.commodity.commodity_id}`,
    });
  },

  btn1Tap(e) {
    console.log("pass", e)
    let app = getApp()
    let that = this
    wx.request({
      url: app.globalData.URL + '/admin/review/handle',
      method: "POST",
      timeout: 500,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        "token": app.globalData.session_key,
        "commodity_id": e.currentTarget.dataset.commodity.commodity_id,
        "option_id": 0, //0上架，2下架
      },
      success: (res) => {
        console.log("pass", res.data)
        wx.showToast({
          title: '处理成功',
          icon: 'none',
        }).then(() => {
          this.init()
        });
      }
    })
  },

  btn2Tap(e) {
    console.log("no pass", e)
    let app = getApp()
    let that = this
    wx.request({
      url: app.globalData.URL + '/admin/review/handle',
      method: "POST",
      timeout: 500,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        "token": app.globalData.session_key,
        "commodity_id": e.currentTarget.dataset.commodity.commodity_id,
        "option_id": 2, //0上架，2下架
      },
      success: (res) => {
        console.log("pass", res.data)
        wx.showToast({
          title: '处理成功',
          icon: 'none',
        }).then(() => {
          this.init()
        });
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