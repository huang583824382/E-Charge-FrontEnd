import {
  fetchPerson
} from '../../../services/usercenter/fetchPerson';
import {
  phoneEncryption
} from '../../../utils/util';
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    personInfo: {
      avatarUrl: '',
      nickName: '',
      gender: 0,
      phoneNumber: '',
    },
    showUnbindConfirm: false,
    pickerOptions: [{
        name: '男',
        code: '1',
      },
      {
        name: '女',
        code: '2',
      },
    ],
    typeVisible: false,
    genderMap: ['', '男', '女'],
  },
  onClickCell({
    currentTarget
  }) {
    const {
      dataset
    } = currentTarget;
    const {
      nickName
    } = this.data.personInfo;

    switch (dataset.type) {
      case 'gender':
        this.setData({
          typeVisible: true,
        });
        break;
      case 'name':
        wx.navigateTo({
          url: `/pages/usercenter/name-edit/index?name=${nickName}`,
        });
        break;
      case 'avatarUrl':
        this.toModifyAvatar();
        break;
      case 'phoneNumber':
        wx.navigateTo({
          url: `/pages/usercenter/phone-edit/index?phone=${this.data.personInfo.phoneNumber}`,
        });
        break
      default: {
        break;
      }
    }
  },
  onClose() {
    this.setData({
      typeVisible: false,
    });
  },
  onConfirm(e) {
    let app = getApp()
    let that = this
    const {
      value
    } = e.detail;
    this.setData({
        typeVisible: false,
        'personInfo.gender': value,
      },
      () => {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '设置成功',
          theme: 'success',
        });
        console.log(value)
        wx.request({
          url: app.globalData.URL + '/user/editGender',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            'token': app.globalData.session_key,
            'gender': value
          },
          success: function (res) {
            console.log(res)
            Toast({
              context: that,
              selector: '#t-toast',
              message: '设置成功',
              theme: 'success',
            });
          }
        })
      },
    );
  },
  async toModifyAvatar() {
    let that = this
    let app = getApp()
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

      wx.uploadFile({
        url: app.globalData.URL + '/user/editAvatar',
        filePath: tempFilePath,
        name: 'img',
        formData: {
          token: app.globalData.session_key,
        },
        success: (res) => {
          if (res.data.code == 'success') {
            Toast({
              context: this,
              selector: '#t-toast',
              message: '设置成功',
              theme: 'success',
            });
            this.init()
          }
        },
        fail: (res) => {
          console.log(res);
          return;
        }
      });

    } catch (error) {
      if (error.errMsg === 'chooseImage:fail cancel') return;
      Toast({
        context: this,
        selector: '#t-toast',
        message: error.errMsg || error.msg || '修改头像出错了',
        theme: 'fail',
      });
    }
  },
  init() {
    var that = this;
    const app = getApp();
    console.log("get user info", app.globalData.uid)
    wx.request({
      url: app.globalData.URL + '/user/info',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'uid': app.globalData.uid
      },
      success: function (res) {
        console.log(res)
        var ret_name = res.data.name;
        var ret_gender = res.data.gender;
        var ret_phone = res.data.phone;
        var ret_iconUrl = res.data.iconUrl
        that.setData({
          'personInfo.nickName': ret_name,
          'personInfo.gender': ret_gender,
          'personInfo.phoneNumber': ret_phone,
          'personInfo.avatarUrl': ret_iconUrl,
          currAuthStep: 3
        });
      }
    })
  },
  onShow: function () {
    this.init()
  },
});