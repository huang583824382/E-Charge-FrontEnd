import updateManager from './common/updateManager';

App({
  globalData: {
    session_key: null,
    uid: null,
    loginPromise: null,
    URL: 'http://localhost:8080'
  },
  onLaunch: function () {
    this.getSession()
    this.refreshSession()
  },
  onShow: function () {
    updateManager();
  },
  getSession() {
    this.globalData.loginPromise = new Promise((resolve, reject) => {
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
              this.globalData.session_key = res.data.session_key;
              if (res.data.option_code == true) {
                console.log("get true")
                this.globalData.session_key = res.data.session_key;
                this.globalData.uid = res.data.uid;
              }
              console.log(res)
              resolve()
            }
          })
        }
      })
    })

  },
  refreshSession() {
    var that = this;
    setInterval(that.getSession, 20 * 60 * 1000);
  }
});