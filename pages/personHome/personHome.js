// pages/personHome/personHome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultAvatarUrl: 'https://cdn-we-retail.ym.tencent.com/miniapp/usercenter/icon-user-center-avatar@2x.png',
    list: [
      [],
      []
    ],
    listLoadStatus: [0, 0],
    tabIndex: 0,
    pageLoading: false,
  },
  goodListPagination: {
    index: 0,
    num: 20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '用户主页',
    })
    const app = getApp()
    const {
      uid
    } = options
    // console.log("token", app.globalData.session_key)
    this.init(uid)
    this.setData({
      pageLoading: true,
      uid: uid
    });
    this.loadGoodsList(true).then(() => {
      this.setData({
        pageLoading: false
      })
    });
  },
  init(uid) {
    var that = this;
    const app = getApp();
    // console.log("get user info", app.globalData.uid)
    // console.log("get user token", app.globalData.session_key)
    wx.request({
      url: app.globalData.URL + '/user/info',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'uid': uid
      },
      success: function (res) {
        console.log(res)
        var ret_name = res.data.name;
        var ret_gender = res.data.gender;
        var ret_phone = res.data.phone;
        var ret_iconUrl = res.data.iconUrl
        that.setData({
          'userInfo.nickName': ret_name,
          'userInfo.gender': ret_gender,
          'userInfo.phoneNumber': ret_phone,
          'userInfo.avatarUrl': ret_iconUrl,
          'userInfo.credit': res.data.credit,
          uid: uid,
          currAuthStep: 3
        });
      }
    })
  },

  tabChangeHandle(e) {
    //console.log(e.detail.value);
    this.setData({
      tabIndex: e.detail.value
    }, () => {
      this.loadGoodsList(true);
    });
  },

  // 设置加载状态
  setLoadStatus(status) {
    var newLoadStatus = this.data.listLoadStatus;
    newLoadStatus[this.data.tabIndex] = status;
    this.setData({
      listLoadStatus: newLoadStatus
    });
  },

  // 点击进入商品详情页
  listClickHandle(e) {
    // const {
    //   index
    // } = e.detail.index;

    // const {
    //   spuId
    // } = this.data.list[this.data.tabIndex][index].itemId;

    const spuId = e.detail.goods.itemId;

    wx.navigateTo({
      url: `/pages/goods/details/index?spuId=${spuId}`,
    });
  },
  async fetchGoodsList(type = 0, pageSize = 20) {
    let that = this
    let app = getApp()
    console.log(type);
    // if (config.useMock) {
    //   return mockFetchGoodsList(pageIndex, pageSize);
    // }
    return new Promise((resolve, reject) => {
      console.log(app.globalData.session_key);
      // 根据类型决定目标url
      var url = getApp().globalData.URL + (type === 0 ? "/user/goods" : "/user/tasks");
      wx.request({
        url: url,
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          token: getApp().globalData.session_key, // token
          uid: that.data.uid,
          size: pageSize, // 商品/任务数量
        },
        success: (res) => {
          console.log("fetch", res)
          if (res.statusCode === 200) {
            console.log(res)
            if (res.data.length === 0) {
              reject();
            } else {
              resolve(res.data);
            }
          } else {
            reject();
          }
        }
      });
    });
  },

  async loadGoodsList(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    }
    // 加载状态：加载中
    this.setLoadStatus(1);

    const pageSize = this.goodListPagination.num;
    console.log("pagesize", pageSize)
    // 获取列表
    try {
      const nextList = await this.fetchGoodsList(this.data.tabIndex, pageSize);
      var newList = this.data.list;
      // 处理数据格式
      if (this.data.tabIndex === 0) {
        nextList.forEach((element, index) => {
          //console.log(element);
          //element.figureUrls = "";
          console.log(getApp().globalData.IMG_SERVER + "/NoPic.jpg");
          element.thumb = (element.figureUrls === "") ? (getApp().globalData.IMG_SERVER + "/NoPic.jpg") : element.figureUrls.split(";")[0];
          element.images = element.figureUrls.split(";");
        });
      }
      // 更新数据和加载状态
      newList[this.data.tabIndex] = fresh ? nextList :
        this.data.list[this.data.tabIndex].concat(nextList);
      var newLoadStatus = this.data.listLoadStatus;
      newLoadStatus[this.data.tabIndex] = 0;
      this.setData({
        list: newList,
        // goodsList: fresh ? nextList : this.data.goodsList.concat(nextList),
        // tasksList: fresh ? nextList : this.data.tasksList.concat(nextList),
        listLoadStatus: newLoadStatus
      });
    } catch (err) {
      console.log(err);
      // 加载状态：加载失败
      this.setLoadStatus(3);
    }
  },

  startChat() {
    wx.navigateTo({
      url: '/pages/chat/chat?conversationID=C2C' + this.data.uid
    })
  },

  startReport() {
    const id = this.data.uid;
    wx.navigateTo({
      url: `/pages/report/report?isUser=true&id=${id}`,
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