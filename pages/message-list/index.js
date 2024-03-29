// const conversationList = [{
//     uid: 1,
//     name: "Hoff",
//     content: "你好！",
//     timeStamp: "19:21",
//     avatarUrl: "/images/Corgi.jpg",
//     unreadNum: 1
//   },
//   {
//     uid: 2,
//     name: "Huang",
//     content: "你好！",
//     timeStamp: "19:19",
//     avatarUrl: "/images/Corgi.jpg",
//     unreadNum: 16
//   },
//   {
//     uid: 3,
//     name: "ZT Shuai",
//     content: "你好！",
//     timeStamp: "19:10",
//     avatarUrl: "/images/Corgi.jpg",
//     unreadNum: 5
//   },
//   {
//     uid: 4,
//     name: "SPEEDSTER",
//     content: "你好！",
//     timeStamp: "18:59",
//     avatarUrl: "/images/Corgi.jpg",
//     unreadNum: 0
//   },
//   {
//     uid: 5,
//     name: "kq",
//     content: "你好！",
//     timeStamp: "18:42",
//     avatarUrl: "/images/Corgi.jpg",
//     unreadNum: 9
//   },
//   {
//     uid: 6,
//     name: "E-Charge",
//     content: "[图片]",
//     timeStamp: "17:32",
//     avatarUrl: "/images/Corgi.jpg",
//     unreadNum: 1
//   },
//   {
//     uid: 7,
//     name: "EC-Test",
//     content: "你好！",
//     timeStamp: "15:03",
//     avatarUrl: "/images/star.png",
//     unreadNum: 100
//   },
//   {
//     uid: 8,
//     name: "virtual",
//     content: "你好！",
//     timeStamp: "昨天",
//     avatarUrl: "/images/Corgi.jpg",
//     unreadNum: 0
//   },
//   {
//     uid: 9,
//     name: "unreal",
//     content: "你好！",
//     timeStamp: "2021-12-31",
//     avatarUrl: "/images/Corgi.jpg",
//     unreadNum: 0
//   },
//   {
//     uid: 10,
//     name: "易窍极",
//     content: "你好！",
//     timeStamp: "2020-1-2",
//     avatarUrl: "/images/Corgi.jpg",
//     unreadNum: 0
//   }
// ];

// const getDefaultData = () => ({
//   showMakePhone: false,
//   userInfo: {
//     avatarUrl: '/images/Corgi.jpg',
//     nickName: 'Young',
//     phoneNumber: '10086',
//   },
//   sessionList,
//   customerServiceInfo: {},
//   currAuthStep: 1,
//   showKefu: true,
//   versionNo: '',
// });

Page({
  data: {
    conversationList: [],
    isEmpty: true,
  },
  methods: {
    init() {

    }
  },
  onTapSession(e) {
    // console.log(this.data.conversationList[e.currentTarget.dataset.index])
    wx.navigateTo({
      url: '/pages/chat/chat?conversationID=' + this.data.conversationList[e.currentTarget.dataset.index].conversationID
    })
  },
  getConversationList() {
    let that = this
    console.log("here")
    let promise = wx.tim.getConversationList();
    promise.then(function (imResponse) {
      that.setData({
        conversationList: imResponse.data.conversationList,
        isEmpty: imResponse.data.conversationList.length == 0,
      })
      // 全量的会话列表，用该列表覆盖原有的会话列表
      console.log("listget", that.data.conversationList)
      // console.log("former list", sessionList)
    }).catch(function (imError) {
      console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
    });
  },
  onLoad() {
    console.log("onloadhere")
    // wx.tim.on(wx.TIM.EVENT.SDK_READY, this.getConversationList)
    wx.tim.on(wx.TIM.EVENT.CONVERSATION_LIST_UPDATED, this.getConversationList);
  },
  onShow() {
    console.log("message-list onshow")
    this.getConversationList()
  },
});