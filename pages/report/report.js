import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    userInfo: null,
    currAuthStep: 3,
    isUser: false,
    type: 0,
    itemInfo: null,
    imageFiles: [],
    reason: '',
    uploadImg: false,
    allSent: false,
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
                uid: res.data.uid,
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
            this.showInfo(false, '出错了，请稍后重试');
          }
        },
        fail: (res) => {
          console.log(res);
          this.showInfo(false, '出错了，请稍后重试');
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
            this.showInfo(false, '出错了，请稍后重试');
          }
        },
        fail: (res) => {
          console.log(res);
          this.showInfo(false, '出错了，请稍后重试');
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
      imageFiles: e.detail.files,
      uploadImg: true
    });
  },

  handleRemove_goods(e) {
    console.log(e);
    var imageFiles = this.data.imageFiles;
    imageFiles.splice(e.detail.index, 1)
    this.setData({
      imageFiles: imageFiles,
      uploadImg: true,
    });
  },

  // FIXME: 提交举报
  formSubmit(e) {
    console.log(this.data.reason);
    console.log(this.data.imageFiles);
    // 发送请求：举报 用户 / 商品
    this.submitReport();
  },

  submitReport() {
    const app = getApp();
    console.log(222222);
    console.log(this.data.isUser);
    // 检查详细信息
    if (this.data.reason.length < 1) {
      this.showInfo(false, "举报理由不能为空！");
      return;
    }
    console.log(this.data.uploadImg);
    /* 格式合法，组装数据，发送请求 */

    // 发送请求
    var report_id = 0;
    var publishPromise;
    if (this.data.uploadImg === true) {
      console.log(this.data.imageFiles);
      console.log(this.data);
      publishPromise = new Promise((resolve, reject) => {
        // 有传过就上传描述的图片
        console.log(app.globalData.session_key);
        wx.uploadFile({
          url: app.globalData.URL + '/report/first',
          filePath: this.data.imageFiles[0].url,
          name: 'image',
          formData: {
            token: app.globalData.session_key,
            target_id: (this.data.isUser ? this.data.userInfo.uid : this.data.itemInfo.itemId),
            imageUrl: this.data.imageFiles[0].url,
            reason: this.data.reason,
            isUser: this.data.isUser ? 1 : 0,
          },
          success: (res) => {
            if (res.statusCode === 200) {
              console.log(res);
              if (res.data.code === "fail") {
                this.showInfo(false, "出错了，请稍后重试");
                return;
              } else {
                console.log(555);
                console.log(res)
                var resData = JSON.parse(res.data);
                report_id = resData.reportId;
                console.log(resData);
                resolve();
              }
            }
          },
          fail: (res) => {
            console.log(res);
            this.showInfo(false, "出错了，请稍后重试")
            return;
          }
        });
      })

      var i = 1;
      publishPromise.then(() => {
        console.log(report_id);
        console.log(this.data.imageFiles.length);
        for (i = 1; i < this.data.imageFiles.length; i++) {
          console.log('i =', i);
          wx.uploadFile({
            url: app.globalData.URL + '/report/second',
            filePath: this.data.imageFiles[i].url,
            name: 'image',
            formData: {
              token: app.globalData.session_key,
              imageUrl: this.data.imageFiles[i].url,
              report_id: report_id
            },
            success: (res) => {
              if (res.statusCode === 200) {
                console.log(res);
                if (res.data.code === "fail") {
                  this.showInfo(false, "出错了，请稍后重试");
                  return;
                } else {
                  console.log(555);
                  //resolve();
                }
              }
            },
            fail: (res) => {
              console.log(res);
              this.showInfo(false, "出错了，请稍后重试")
              return;
            }
          })
        }
      })
    }
    // 无上传图片
    else {
      console.log(this.data);
      publishPromise = new Promise((resolve, reject) => {
        wx.request({
          url: app.globalData.URL + '/report/no-pic',
          method: "POST",
          timeout: 500,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            token: app.globalData.session_key,
            target_id: (this.data.isUser ? this.data.userInfo.uid : this.data.itemInfo.itemId),
            reason: this.data.reason,
            isUser: this.data.isUser ? 1 : 0,
          },
          success: (res) => {
            if (res.statusCode === 200) {
              console.log(res);
              if (res.data.code === "fail") {
                this.showInfo(false, "验证失败，请退出后重试！");
                return;
              } else if (res.data.code === "success") {
                resolve();
              }
            }
          },
          fail: (res) => {
            this.showInfo(false, "出错了，请稍后重试")
            return;
          }
        });

      })
    }
    // 请求完成后根据结果作出响应
    publishPromise.then(() => {
      this.setData({
        allSent: true
      });
      this.checkAndSwitchTab(true, "发布成功！");
    })
  },


  showInfo(suc, msg) {
    Toast({
      context: this,
      selector: '#report-t-toast',
      message: msg,
      theme: suc ? 'success' : 'fail',
    });
  },

  reset() {
    // 清空状态
    this.setData({
      userInfo: null,
      isUser: false,
      type: 0,
      itemInfo: null,
      reason: '',
      imageFiles: [],
      uploadImg: false,
      allSent: false,
    })
    console.log(this.data.reason);
    console.log(this.data.imageFiles);
  },

  checkAndSwitchTab() {
    // 数据全部传输完，说明可以跳转
    if (this.data.allSent === true) {
      // 延时跳转
      this.reset();
      this.showInfo(true, "举报成功！");
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/home/home'
        });
      }, 300)
    }
  },


});