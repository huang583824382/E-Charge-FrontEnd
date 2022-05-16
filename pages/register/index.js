import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    personInfo: {
      avatarUrl: '/images/Corgi.jpg',
      nickName: '',
      gender: 0,
      phoneNumber: '',
    },
  },
  init() {},

  onChange(event) {
    console.log('checkbox', event.detail.value);
  },

  onShow() {
    // 请求code
    wx.login({
      timeout: 1000,
      success: (res) => {
        // 获取到code，请求后端
        console.log(res)
        wx.request({
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          url: 'http://localhost:8080/start/login',
          data: {
            code: res.code,
          },
          success: (res) => {

            console.log(res.data)
            if (res.data.login == true) {
              wx.switchTab({
                // to home
                url: '/pages/home/home'
              });
            } else {
              // register
              console.log("register")
              // 自动
              // 获取用户信息
              wx.getUserInfo({
                success: (res) => {

                }
              })
            }
            console.log(res)
          }
        })
      }
    })
  },

  onTapAvatar({
    target
  }) {
    this.toModifyAvatar();
  },

  onTapBtn({
    target
  }) {
    console.log(target);
    // wx.request({
    //   url: 'http://localhost:8080/start/register',
    //   method: "POST",
    //   timeout: 500,
    //   success(res) {
    //     console.log(res);
    //   }
    // })


    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  async toModifyAvatar() {
    try {
      const tempFilePath = await new Promise((resolve, reject) => {
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: (res) => {
            const {
              path,
              size
            } = res.tempFiles[0];
            if (size <= 10485760) {
              resolve(path);
            } else {
              reject({
                errMsg: '图片大小超出限制，请重新上传'
              });
            }
          },
          fail: (err) => reject(err),
        });
      });
      const tempUrlArr = tempFilePath.split('/');
      const tempFileName = tempUrlArr[tempUrlArr.length - 1];
      Toast({
        context: this,
        selector: '#register-t-toast',
        message: `已选择图片-${tempFileName}`,
        theme: 'success',
      });
      // set url
      var newInfo = this.data.personInfo;
      newInfo.avatarUrl = tempFilePath;
      this.setData({
        personInfo: newInfo
      });
    } catch (error) {
      console.log(error);
      if (error.errMsg === 'chooseImage:fail cancel') return;
      Toast({
        context: this,
        selector: '#register-t-toast',
        message: error.errMsg || error.msg || '修改头像出错了',
        theme: 'fail',
      });
    }
  }
})