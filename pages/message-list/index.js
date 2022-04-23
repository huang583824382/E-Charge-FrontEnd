const sessionList = [{
    uid: 1,
    name: "Hoff",
    content: "你好！",
    timeStamp: "19:21",
    avatarUrl: "/images/Corgi.jpg",
    unreadNum: 16
  },
  {
    uid: 2,
    name: "Huang",
    content: "你好！",
    timeStamp: "19:19",
    avatarUrl: "/images/Corgi.jpg",
    unreadNum: 1
  }
];

const getDefaultData = () => ({
  showMakePhone: false,
  userInfo: {
    avatarUrl: '/images/Corgi.jpg',
    nickName: 'Young',
    phoneNumber: '10086',
  },
  sessionList,
  customerServiceInfo: {},
  currAuthStep: 1,
  showKefu: true,
  versionNo: '',
});

Page({
  data: getDefaultData(),
  methods: {
    init() {

    }
  },
  onTapSession(e) {
    wx.navigateTo({
      url: '/pages/chat/chat'
    })
  }
});