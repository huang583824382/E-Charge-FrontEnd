import {
  fetchUserCenter
} from '../../services/usercenter/fetchUsercenter';
import Toast from 'tdesign-miniprogram/toast/index';

const menuData = [
  [{
      title: '积分',
      tit: '',
      url: '',
      type: 'point',
    },
    {
      title: '信誉度',
      tit: '100',
      url: '',
      type: 'credit',
    }
  ]
];

const orderTagInfos = [{
    title: '待付款',
    iconName: 'wallet',
    orderNum: 3,
    tabType: 1,
    isCustomer: 1,
  },
  {
    title: '待收货',
    iconName: 'package',
    orderNum: 2,
    tabType: 2,
    isCustomer: 1,
  },
  {
    title: '待评价',
    iconName: 'comment',
    orderNum: 0,
    tabType: 3,
    isCustomer: 1,
  },
  {
    title: '已完成',
    iconName: 'check',
    orderNum: 0,
    tabType: 4,
    isCustomer: 1,
  },
  {
    title: '退款/售后',
    iconName: 'exchang',
    orderNum: 0,
    tabType: 5,
    isCustomer: 1,
  }
];

const pubTagInfos = [{
    title: '未付款',
    iconName: 'wallet',
    orderNum: 0,
    tabType: 1,
    isCustomer: 0,
  },
  {
    title: '未完成',
    iconName: 'package',
    orderNum: 0,
    tabType: 2,
    isCustomer: 0,
  },
  {
    title: '待评价',
    iconName: 'comment',
    orderNum: 0,
    tabType: 3,
    isCustomer: 0,
  },
  {
    title: '已完成',
    iconName: 'check',
    orderNum: 0,
    tabType: 4,
    isCustomer: 0,
  },
  {
    title: '追回/后悔',
    iconName: 'exchang',
    orderNum: 0,
    tabType: 5,
    isCustomer: 0,
  }
];

// const getDefaultData = () => ({
//   showMakePhone: false,
//   userInfo: {
//     avatarUrl: '',
//     nickName: '正在登录...',
//     phoneNumber: '',
//   },
//   menuData,
//   orderTagInfos,
//   pubTagInfos,
//   customerServiceInfo: {},
//   currAuthStep: 1,
//   showKefu: true,
//   versionNo: '',
// });

Page({
  data: {
    showMakePhone: false,
    userInfo: {
      avatarUrl: '',
      nickName: '正在登录...',
      phoneNumber: '',
      isadmin: false,
    },
    menuData,
    orderTagInfos: orderTagInfos,
    pubTagInfos: pubTagInfos,
    customerServiceInfo: {},
    currAuthStep: 1,
    showKefu: true,
    versionNo: '',
  },

  // onLoad() {
  //   this.getVersionInfo();
  // },

  onShow() {
    this.getTabBar().init();
    this.init();
  },
  onPullDownRefresh() {
    this.init();
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
        console.log(res.data)
        that.setData({
          'userInfo.nickName': ret_name,
          'userInfo.gender': ret_gender,
          'userInfo.phoneNumber': ret_phone,
          'userInfo.avatarUrl': ret_iconUrl,
          'userInfo.isadmin': res.data.admin,
          currAuthStep: 3
        });
      }
    })
    // this.fetUseriInfoHandle();
    wx.request({
      url: app.globalData.URL + '/trans/info',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'token': app.globalData.session_key,
      },
      success: (res) => {
        console.log("/trans/info", res)
        for (var i = 0; i < res.data.length; i++) {
          that.data.orderTagInfos[i].orderNum = res.data[i].num
        }
        that.setData({
          orderTagInfos: that.data.orderTagInfos
        })
      }
    })
  },

  // fetUseriInfoHandle() {
  //   fetchUserCenter().then(
  //     ({
  //       userInfo,
  //       countsData,
  //       orderTagInfos: orderInfo,
  //       customerServiceInfo,
  //     }) => {
  //       // eslint-disable-next-line no-unused-expressions
  //       menuData?.[0].forEach((v) => {
  //         countsData.forEach((counts) => {
  //           if (counts.type === v.type) {
  //             // eslint-disable-next-line no-param-reassign
  //             v.tit = counts.num;
  //           }
  //         });
  //       });
  //       const info = orderTagInfos.map((v, index) => ({
  //         ...v,
  //         ...orderInfo[index],
  //       }));
  //       this.setData({
  //         userInfo,
  //         menuData,
  //         orderTagInfos: info,
  //         customerServiceInfo,
  //         currAuthStep: 2,
  //       });
  //       wx.stopPullDownRefresh();
  //     },
  //   );
  // },

  onClickCell({
    currentTarget
  }) {
    const {
      type
    } = currentTarget.dataset;

    switch (type) {
      case 'address': {
        wx.navigateTo({
          url: '/pages/usercenter/address/list/index'
        });
        break;
      }
      case 'service': {
        this.openMakePhone();
        break;
      }
      case 'help-center': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了帮助中心',
          icon: '',
          duration: 1000,
        });
        wx.navigateTo({
          url: `/pages/personHome/personHome?uid=${20}`,
        })
        break;
      }
      case 'point': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了积分菜单',
          icon: '',
          duration: 1000,
        });
        break;
      }
      case 'coupon': {
        wx.navigateTo({
          url: '/pages/coupon/coupon-list/index'
        });
        break;
      }
      default: {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '未知跳转',
          icon: '',
          duration: 1000,
        });
        break;
      }
    }
  },

  jumpNav(e) {
    const status = e.detail.tabType;
    const customer = e.detail.isCustomer
    console.log("jumpNav", status, customer)
    if (status === 0) {
      wx.navigateTo({
        url: `/pages/order/after-service-list/index?customer=${customer}`
      });
    } else {
      console.log("navigate to", status)
      wx.navigateTo({
        url: `/pages/order/order-list/index?status=${status}&customer=${customer}`
      });
    }
  },

  jumpAllOrderNotCustomer() {
    console.log("jumpAllOrderNotCustomer")
    wx.navigateTo({
      url: `/pages/order/order-list/index?status=0&customer=0`
    });
  },

  jumpAllOrderCustomer() {
    console.log("jumpAllOrderCustomer")
    wx.navigateTo({
      url: `/pages/order/order-list/index?status=0&customer=1`
    });
  },

  openMakePhone() {
    this.setData({
      showMakePhone: true
    });
  },

  closeMakePhone() {
    this.setData({
      showMakePhone: false
    });
  },

  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.customerServiceInfo.servicePhone,
    });
  },

  gotoUserEditPage() {
    const {
      currAuthStep
    } = this.data;
    wx.navigateTo({
      url: '/pages/usercenter/person-info/index'
    });
  },
  enterAdmin() {
    wx.navigateTo({
      url: '/pages/admin/admin'
    });
  },

  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const {
      version,
      envVersion = __wxConfig
    } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion,
    });
  },
  // onLoad() {

  // },
  onPullDownRefresh() {
    this.init();
  },
});