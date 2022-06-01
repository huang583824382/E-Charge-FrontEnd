// pages/admin/report/report-detail/report-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    checked: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var report_id = options.reportId
    wx.setNavigationBarTitle({
      title: '举报详情'
    });
    console.log(options, report_id)
    this.setData({
      report_id: report_id
    })
  },

  init(report_id) {
    let app = getApp()
    let that = this
    wx.request({
      url: app.globalData.URL + '/admin/report/detail',
      method: "POST",
      timeout: 500,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        "token": app.globalData.session_key,
        "report_id": parseInt(report_id)
      },
      success: (res) => {
        console.log("get report detail", res.data)
        that.setData(res.data)
      }
    })
  },
  seeBigImg: function (e) {
    var that = this;
    var idx = parseInt(e.currentTarget.dataset.index);
    var src = that.data.urls[idx];
    console.log(src)
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: that.data.urls // 需要预览的图片http链接列表
    })
  },

  reject() {
    console.log("reject")
    let app = getApp()
    let that = this
    console.log("publish3", this.data.checked)
    wx.request({
      url: app.globalData.URL + '/admin/punish',
      method: "POST",
      timeout: 500,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        "token": app.globalData.session_key,
        "report_id": this.data.report_id,
        "option_id": 0, //3：扣3分，2：扣1分，1：警告处理，0：不处理
        "offShelf": 0, //是否下架商品
      },
      success: (res) => {
        console.log("reject punish", res.data)
        wx.showToast({
          title: '处理成功',
          icon: 'none',
        }).then(() => {
          wx.navigateBack({
            delta: 0,
          })
        });
      }
    })
  },

  agree() {
    console.log("agree")
    this.setData({
      visible: true
    })
  },

  visibleChange() {
    this.setData({
      visible: !this.data.visible
    })
  },

  handleChange(e) {
    this.setData({
      checked: e.detail.checked,
    });
  },

  punish3() {
    let app = getApp()
    let that = this
    console.log("publish3", this.data.checked)
    wx.request({
      url: app.globalData.URL + '/admin/punish',
      method: "POST",
      timeout: 500,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        "token": app.globalData.session_key,
        "report_id": this.data.report_id,
        "option_id": 3, //3：扣3分，2：扣1分，1：警告处理，0：不处理
        "offShelf": this.data.checked ? 1 : 0, //是否下架商品
      },
      success: (res) => {
        console.log("punish3", res.data)
        wx.showToast({
          title: '处理成功',
          icon: 'none',
        }).then(() => {
          wx.navigateBack({
            delta: 0,
          })
        });
      }
    })
  },

  punish1() {
    let app = getApp()
    let that = this
    console.log("publish1", this.data.checked)
    wx.request({
      url: app.globalData.URL + '/admin/punish',
      method: "POST",
      timeout: 500,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        "token": app.globalData.session_key,
        "report_id": this.data.report_id,
        "option_id": 2, //3：扣3分，2：扣1分，1：警告处理，0：不处理
        "offShelf": this.data.checked ? 1 : 0, //是否下架商品
      },
      success: (res) => {
        console.log("punish2", res.data)
        wx.showToast({
          title: '处理成功',
          icon: 'none',
        }).then(() => {
          wx.navigateBack({
            delta: 0,
          })
        });
      }
    })
  },

  punish0() {
    let app = getApp()
    let that = this
    console.log("publish0", this.data.checked)
    wx.request({
      url: app.globalData.URL + '/admin/punish',
      method: "POST",
      timeout: 500,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        "token": app.globalData.session_key,
        "report_id": this.data.report_id,
        "option_id": 1, //3：扣3分，2：扣1分，1：警告处理，0：不处理
        "offShelf": this.data.checked ? 1 : 0, //是否下架商品
      },
      success: (res) => {
        console.log("punish0", res.data)
        wx.showToast({
          title: '处理成功',
          icon: 'none',
        }).then(() => {
          wx.navigateBack({
            delta: 0,
          })
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
    this.init(this.data.report_id)
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