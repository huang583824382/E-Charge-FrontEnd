import updateManager from './common/updateManager';
import TIM from 'tim-wx-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';

let options = {
  SDKAppID: 1400680357 // 接入时需要将0替换为您的云通信应用的 SDKAppID，类型为 Number
};

wx.TIM = TIM
wx.tim_on = false
App({
  globalData: {
    session_key: '',
    uid: null,
    loginPromise: null,
    URL: 'https://localhost:8081',
    IMG_SERVER: 'https://localhost:8081/img'
  },
  onLaunch: function () {
    this.getSession()
    this.refreshSession()
    wx.tim = TIM.create(options);
    // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
    // tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
    wx.tim.setLogLevel(1); // release级别，SDK 输出关键信息，生产环境时建议使用

    // 注册 COS SDK 插件
    wx.tim.registerPlugin({
      'tim-upload-plugin': TIMUploadPlugin
    });
    wx.tim.on(wx.TIM.EVENT.SDK_NOT_READY, this.onSdkNotReady)
    wx.tim.on(wx.TIM.EVENT.KICKED_OUT, this.onKickedOut)
    wx.tim.on(wx.TIM.EVENT.ERROR, this.onTIMError)
    wx.tim.on(wx.TIM.EVENT.NET_STATE_CHANGE, this.onNetStateChange)
    wx.tim.on(wx.TIM.EVENT.SDK_RELOAD, this.onSDKReload)
    // wx.tim.on(wx.TIM.EVENT.SDK_READY, this.onSDKReady)
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
          // console.log(res)
          wx.request({
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: this.globalData.URL + '/start/login',
            data: {
              code: res.code,
            },
            success: (res) => {
              console.log("get login reply", res.data)
              this.globalData.session_key = res.data.session_key;
              this.globalData.openid = res.data.openid;
              if (res.data.option_code == true) {
                // console.log("get true")
                this.globalData.uid = res.data.uid;
              }
              // console.log(res)
              resolve()
            }
          })
        }
      })
    })

  },
  refreshSession(e) {
    var that = this;
    setInterval(that.getSession, 20 * 60 * 1000);
  },
  onSDKReady: function (e) {
    console.log("sdk ready")
  },
  onSdkNotReady: function (e) {

  },

  onKickedOut: function (e) {
    wx.showToast({
      title: '您被踢下线',
      icon: 'error',
    })
    wx.navigateTo({
      url: './pages/TUI-Login/login',
    })
  },

  onTIMError: function (e) {},

  onNetStateChange: function (e) {

  },

  onSDKReload: function (e) {

  },
});