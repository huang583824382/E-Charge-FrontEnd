import {
  phoneRegCheck
} from '../../utils/util';
import Toast from 'tdesign-miniprogram/toast/index';
import {
  genTestUserSig
} from '../../debug/GenerateTestUserSig.js';


Page({
  data: {
    personInfo: {
      avatarUrl: '/images/Corgi.jpg',
      nickName: '',
      gender: 0,
      phoneNumber: '',
    },
    getProfile: false, // 是否已获取用户信息
    uploadImg: false, // 是否上传过图片
    showPicker: false, // 是否显示性别选择弹窗
    genderOp: [{
        name: '男',
        code: '1'
      },
      {
        name: '女',
        code: '2'
      }
    ], // 性别选项
    genderMap: ["", "男", "女"] // 性别映射
  },
  init() {},

  IMlogin() {
    let userID = "" + getApp().globalData.uid
    let userSig = genTestUserSig(userID).userSig
    return wx.tim.login({
      userID: userID,
      userSig: userSig
    })
  },

  onLoad() {
    console.log("register onload")
    const app = getApp();
    app.globalData.loginPromise.then(() => {
      console.log("uid: " + app.globalData.uid);

      // 已注册用户，进入主页面
      if (app.globalData.uid != null) {
        this.IMlogin(); //登录IM
        wx.switchTab({
          // to home
          url: '/pages/home/home'
        });
      }
      // 未注册用户，留在注册页面
    })

  },

  // 获取用户微信信息作为默认属性
  getUserProfile(e) {
    // 如果还未获取过用户信息，询问是否可以拉取
    if (!this.data.getProfile) {
      wx.getUserProfile({
        desc: '用于完善您的默认信息',
        success: (res) => {
          console.log(res);
          var newInfo = this.data.personInfo;
          newInfo.avatarUrl = res.userInfo.avatarUrl;
          newInfo.nickName = res.userInfo.nickName;
          newInfo.gender = res.userInfo.gender;
          this.setData({
            personInfo: newInfo,
            getProfile: true
          });
        }
      });
    }
  },

  // 点击头像上传图片
  onTapAvatar({
    target
  }) {
    // 如果还未获取用户信息，先触发用户信息的获取
    if (!this.data.getProfile) {
      this.getUserProfile(null);
    }
    // 否则上传图像
    else {
      this.toModifyAvatar();
    }
  },

  // 改变昵称
  onNameChange(e) {
    this.setData({
      'personInfo.nickName': e.detail.value
    });
  },

  // 改变手机号
  onPhoneNumChange(e) {
    this.setData({
      'personInfo.phoneNumber': e.detail.value
    });
  },

  // 点击选择性别，显示弹窗
  onTapGender(e) {
    // 如果还未获取用户信息，先触发用户信息的获取
    if (!this.data.getProfile) {
      this.getUserProfile(null);
    }
    // 否则显示设置弹窗
    else {
      this.setData({
        showPicker: true,
      });
    }
  },

  // 确认选择，设置性别并关闭弹窗
  onConfirm(e) {
    this.setData({
      'personInfo.gender': e.detail.value,
      showPicker: false
    });
  },

  // 不改变选择，直接关闭
  onClose(e) {
    this.setData({
      showPicker: false
    })
  },

  // 提交注册信息
  onTapBtn(e) {
    /* 检查数据格式 */
    const app = getApp();
    // 检查昵称格式
    if (this.data.personInfo.nickName.length < 3 || this.data.personInfo.nickName > 8) {
      this.showInfo(false, "昵称长度不合法！");
      return;
    }
    // 检查手机号格式
    else if (this.data.personInfo.phoneNumber === '' ||
      !phoneRegCheck(this.data.personInfo.phoneNumber)) {
      this.showInfo(false, "手机号格式错误！");
      return;
    }
    // 检查性别是否为空
    else if (this.data.personInfo.gender === 0) {
      this.showInfo(false, "性别不能为空！");
      return;
    }
    console.log(this.data.uploadImg);
    /* 格式合法，组装数据，发送请求 */
    // 发送请求
    app.globalData.loginPromise = new Promise((resolve, reject) => {
      if (this.data.uploadImg === true) {
        // 有上传头像
        wx.uploadFile({
          url: app.globalData.URL + '/start/register/ava',
          filePath: this.data.personInfo.avatarUrl,
          name: 'img',
          formData: {
            session_key: app.globalData.session_key,
            avatar_url: this.data.personInfo.avatarUrl,
            nickName: this.data.personInfo.nickName,
            phoneNumber: this.data.personInfo.phoneNumber,
            gender: this.data.personInfo.gender
          },
          success: (res) => {
            if (res.statusCode === 200) {
              console.log(res);
              if (res.data.info === "verification error") {
                this.showInfo(false, "验证失败，请退出后重试！");
                return;
              } else if (res.data.info === "same nickname") {
                this.showInfo(false, "昵称已被占用！");
                return;
              } else if (res.data.info === "same phone number") {
                this.showInfo(false, "手机号绑定了其它账号！");
                return;
              } else {
                // 设置uid
                app.globalData.uid = res.data.uid;
                this.data.name = res.data.name;
                this.data.avator = res.data.avator;
                console.log(555);
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
      } else {
        // 无上传头像
        wx.request({
          url: app.globalData.URL + '/start/register/url',
          method: "POST",
          timeout: 500,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            session_key: app.globalData.session_key,
            avatar_url: this.data.personInfo.avatarUrl,
            nickName: this.data.personInfo.nickName,
            phoneNumber: this.data.personInfo.phoneNumber,
            gender: this.data.personInfo.gender
          },
          success: (res) => {
            if (res.statusCode === 200) {
              console.log(res);
              if (res.data.info === "verification error") {
                this.showInfo(false, "验证失败，请退出后重试！");
                return;
              } else if (res.data.info === "same nickname") {
                this.showInfo(false, "昵称已被占用！");
                return;
              } else if (res.data.info === "same phone number") {
                this.showInfo(false, "手机号绑定了其它账号！");
                return;
              } else if (res.data.info === "success") {
                // 设置uid
                app.globalData.uid = res.data.uid;
                this.data.name = res.data.name;
                this.data.avator = res.data.avator;
                resolve();
              }
            }
          },
          fail: (res) => {
            this.showInfo(false, "出错了，请稍后重试")
            return;
          }
        })
      }
    })
    // 请求完成后根据结果作出响应
    getApp().globalData.loginPromise.then(() => {
      this.postReg(true, "注册成功！");
    })
  },

  // 提示信息
  showInfo(suc, msg) {
    Toast({
      context: this,
      selector: '#register-t-toast',
      message: msg,
      theme: suc ? 'success' : 'fail',
    });
  },

  // 注册后操作
  postReg(suc, msg) {
    console.log(666);
    // 显示操作结果
    this.showInfo(suc, msg);
    // 判断是否可以跳转入主页面
    this.checkAndSwitchTab();
  },

  // 检查是否能跳转，能则进入主页面
  checkAndSwitchTab() {
    let that = this;
    console.log(that.data)
    // uid不为空，说明注册成功
    if (getApp().globalData.uid !== null) {
      // 延时跳转
      this.IMlogin(); //登录IM
      let onReadyFun = function () {
        setTimeout(() => {
          wx.tim.updateMyProfile({
            nick: that.data.name,
            avatar: that.data.avator,
          }).then(function (imResponse) {
            console.log("更新资料成功", imResponse.data); // 
          }).catch(function (imError) {
            console.warn('updateMyProfile error:', imError); // 更新资料失败的相关信息
          });
          wx.switchTab({
            url: '/pages/home/home'
          });
        }, 300)
      }
      wx.tim.on(wx.TIM.EVENT.SDK_READY, onReadyFun)
    }
  },

  // 异步选择头像
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
      // 设置头像URL
      var newInfo = this.data.personInfo;
      newInfo.avatarUrl = tempFilePath;
      this.setData({
        personInfo: newInfo,
        uploadImg: true
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