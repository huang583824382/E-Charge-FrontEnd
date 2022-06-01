Page({
  data: {
    userInfo: null,
    currAuthStep: 3,
    isUser: false,
    type: 0,
    itemInfo: null,
    imageFiles: [],
    reason: '',
  },

  onLoad(option) {
    const app = getApp();
    const {
      isUser,
      id
    } = option;

    console.log(option);
    var boolIsUser = (isUser === "true" ? true : false);
    var intId = parseInt(id);
    this.setData({
      isUser: boolIsUser
    });
    // 获取用户信息
    if (boolIsUser) {
      wx.request({
        url: app.globalData.URL + '/user/info',
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          uid: intId // uid
        },
        success: (res) => {
          console.log(res);
          if (res.statusCode == 200) {
            if (res.data != null) {
              var user = {
                nickName: res.data.name,
                avatarUrl: res.data.iconUrl,
                gender: res.data.gender,
                phone: res.data.phone,
              };
              this.setData({
                userInfo: user
              });
              console.log(this.data.userInfo);
            }
          } else {

          }
        },
        fail: (res) => {
          console.log(res);

        }
      });
    }
    // 获取发布项信息
    else {
      wx.request({
        url: app.globalData.URL + '/commodity/info',
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          token: app.globalData.session_key,
          itemId: intId // itemId
        },
        success: (res) => {
          console.log(res);
          if (res.statusCode == 200) {
            if (res.data.code === "success") {
              var item = res.data.commodity;
              var coverUrl;
              if (item.figureUrls !== '') {
                coverUrl = item.figureUrls.split(";")[0];
              } else if (item.type === 0) {
                coverUrl = app.globalData.IMG_SERVER + '/NoPic.jpg';
              } else {
                coverUrl = '';
              }
              item.figureUrls = coverUrl;
              this.setData({
                itemInfo: item,
                type: item.type
              });
            }
          } else {

          }
        },
        fail: (res) => {
          console.log(res);

        }
      });

    }
  },

  onInputValue(e) {
    console.log(e);
    this.setData({
      reason: e.detail.value
    });
  },

  handleSuccess_goods(e) {
    console.log(e);
    this.setData({
      imageFiles: e.detail.files
    });
  },

  handleRemove_goods(e) {
    console.log(e);
    this.setData({
      imageFiles: e.detail.files
    });
  },

  // TODO: 提交举报
  formSubmit(e) {
    console.log(this.data.reason);
    console.log(this.data.imageFiles);
    // 发送请求：用户 / 商品


    // 提示操作结果

    // 清空状态
    this.setData({
      reason: '',
      imageFiles: []
    })
    console.log(this.data.reason);
    console.log(this.data.imageFiles);
    // 返回主页
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

});