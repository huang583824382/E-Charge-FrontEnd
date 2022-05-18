// chat.js
// let toast = require('../../utils/toast.js');
// let chatInput = require('./chat-input/chat-input');
var utils = require("../../utils/util")
import dayjs from './dayjs'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    desMessage: '',
    messageList: [{
        dataTime: "13:03",
        msgType: "text",
        textMessage: "你好小萌新！",
        userImgSrc: "/images/Corgi.jpg",
        to: 0,
      },
      {
        dataTime: "15:04",
        msgType: "text",
        textMessage: "你好，易窍极！",
        userImgSrc: "/images/Corgi.jpg",
        to: 1,
      },
      {
        dataTime: "17:32",
        msgType: "img",
        textMessage: "你也好小萌新！",
        ImgSrc: "/images/Corgi.jpg",
        userImgSrc: "/images/Corgi.jpg",
        to: 1,
      }
    ],
    friendHeadUrl: '',
    // textMessage: '',
    chatItems: [],
    scrollTopTimeStamp: 0,
    height: 0, //屏幕高度
    chatHeight: 0, //聊天屏幕高度
    normalDataTime: '',
  },

  updateShowTime() {
    let between = 5 * 60
    let lastTime = this.data.messageList[this.data.messageList.length - 1].time
    for (let i = this.data.messageList.length - 1; i >= 0; i--) {
      this.data.messageList[i].TimeContent = this.messageTimeForShow(this.data.messageList[i])
      if (lastTime - this.data.messageList[i].time < between && i != 0) {
        this.data.messageList[i].showTime = false
      } else {
        this.data.messageList[i].showTime = true
        lastTime = this.data.messageList[i].time
        console.log(this.data.messageList[i].TimeContent)
      }
    }
    this.setData({
      messageList: this.data.messageList
    })
  },
  messageTimeForShow(messageTime) {
    const interval = 5 * 60 * 1000;
    const nowTime = messageTime.time * 1000;
    const lastTime = this.data.messageList.slice(-1)[0].time * 1000;
    console.log(dayjs(nowTime).format('YYYY-MM-DD HH:mm:ss'))
    return dayjs(nowTime).format('YYYY-MM-DD HH:mm:ss')
  },
  refresh() {
    if (this.data.isCompleted) {
      this.setData({
        isCompleted: true,
        triggered: false,
      });
      return;
    }
    this.getFormerMessage();
    setTimeout(() => {
      this.setData({
        triggered: false,
      });
    }, 2000);
  },
  getFormerMessage() {
    if (!this.data.isCompleted) {
      wx.tim.getMessageList({
        conversationID: this.data.conversationID,
        nextReqMessageID: this.data.nextReqMessageID,
        count: 15,
      }).then((res) => {
        console.log(res.data)
        // this.showMoreHistoryMessageTime(res.data.messageList);
        const {
          messageList
        } = res.data; // 消息列表。
        this.data.nextReqMessageID = res.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
        this.data.isCompleted = res.data.isCompleted; // 表示是否已经拉完所有消息。
        this.data.messageList = [...messageList, ...this.data.messageList];
        // if (messageList.length > 0 && this.data.messageList.length < this.data.unreadCount) {
        //   this.getMessageList(conversation);
        // }
        this.updateShowTime()
        this.$handleMessageRender(this.data.messageList, messageList);
      });
    }
  },
  // 历史消息渲染
  $handleMessageRender(messageList, currentMessageList) {
    // this.showHistoryMessageTime(currentMessageList);
    for (let i = 0; i < messageList.length; i++) {
      if (messageList[i].flow === 'out') {
        messageList[i].isSelf = true;
      }
    }
    if (messageList.length > 0) {
      this.setData({
        messageList,
        desMessage: 'ID' + currentMessageList[currentMessageList.length - 1].ID
      }, () => {});
    }
  },
  sendMessage(e) {
    var message = e.detail.message
    console.log(e, "send")
    this.messageTimeForShow(message);
    message.isSelf = true;
    this.data.messageList.push(message);
    this.setData({
      messageList: this.data.messageList,
      desMessage: 'ID' + this.data.messageList[this.data.messageList.length - 1].ID,
    });
  },
  freshMessageList() {
    let that = this
    wx.tim.getMessageList({
      conversationID: that.data.conversationID,
      count: 15
    }).then((imResponse) => {
      console.log('get response', imResponse)
      console.log('ID ', 'ID' + imResponse.data.messageList[imResponse.data.messageList.length - 1].ID)
      that.setData({
        messageList: imResponse.data.messageList, // 消息列表。
        nextReqMessageID: imResponse.data.nextReqMessageID, // 用于续拉，分页续拉时需传入该字段。
        isCompleted: imResponse.data.isCompleted, // 表示是否已经拉完所有消息。
        desMessage: 'ID' + imResponse.data.messageList[imResponse.data.messageList.length - 1].ID
      })
      this.updateShowTime()
      // this.messageTimeForShow(this.data.messageList[0])
      // that.setData({
      //   desMessage: imResponse.data.messageList[imResponse.data.messageList.length - 1].id
      // }, () => {})
    });
  },

  // {
  //     dataTime: '',//当前时间
  //     msgType: '',//发送消息类型
  //     userImgSrc: '',//用户头像
  //     textMessage: '',//文字消息
  //     to:0\1 ,0 收到；1 发出
  //     sendImgSrc: '',//图片路径
  //   }

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    that.setData({
      conversationID: options.conversationID
    })

    wx.getSystemInfo({
      success(res) {
        that.setData({
          height: wx.getSystemInfoSync().windowHeight,
          chatHeight: wx.getSystemInfoSync().windowHeight - 55
        })
      }
    })
    wx.tim.on(wx.TIM.EVENT.MESSAGE_RECEIVED, this.freshMessageList)
  },

  onShow: function () {
    let that = this
    wx.tim.getConversationProfile(that.data.conversationID).then(function (imResponse) {
      // 获取成功
      console.log(imResponse.data.conversation); // 会话资料
      wx.setNavigationBarTitle({
        title: imResponse.data.conversation.userProfile.nick
      })
      that.setData({
        conversation: imResponse.data.conversation
      })
      wx.tim.setMessageRead({
        conversationID: that.data.conversationID
      }).then(function (imResponse) {
        // 已读上报成功，指定 ID 的会话的 unreadCount 属性值被置为0
      }).catch(function (imError) {
        // 已读上报失败
        console.warn('setMessageRead error:', imError);
      });
    }).catch(function (imError) {
      console.warn('getConversationProfile error:', imError); // 获取会话资料失败的相关信息
    });
    // _this.initData();
    //获取屏幕的高度
    this.freshMessageList();
  },
  initData: function () {
    let that = this;
    let systemInfo = wx.getSystemInfoSync();
    // chatInput.init(this, {
    //   systemInfo: systemInfo,
    //   minVoiceTime: 1,
    //   maxVoiceTime: 60,
    //   startTimeDown: 56,
    //   format: 'mp3', //aac/mp3
    //   sendButtonBgColor: 'mediumseagreen',
    //   sendButtonTextColor: 'white',
    //   extraArr: [{
    //     picName: 'choose_picture',
    //     description: '照片'
    //   }, {
    //     picName: 'take_photos',
    //     description: '拍摄'
    //   }],
    //   // tabbarHeigth: 48
    // });

    that.setData({
      pageHeight: systemInfo.windowHeight,
      normalDataTime: utils.formatTime(new Date()),
    });
    wx.setNavigationBarTitle({
      title: 'E-Charge'
    });
    that.textButton();
    that.extraButton();
    that.voiceButton();
  },
  textButton: function () {
    var that = this;
    // chatInput.setTextMessageListener(function (e) {
    //   let content = e.detail.value;
    //   console.log(content);
    //   var list = that.data.messageList;
    //   var temp = {
    //     userImgSrc: '../../image/chat/extra/close_chat.png',
    //     textMessage: content,
    //     dataTime: utils.formatTime(new Date()),
    //     msg_type: 'text',
    //     type: 1
    //   };
    //   list.push(temp);
    //   that.setData({
    //     messageList: list,
    //   })
    // });

  },
  voiceButton: function () {
    var that = this;
    // chatInput.recordVoiceListener(function (res, duration) {
    //   let tempFilePath = res.tempFilePath;
    //   let vDuration = duration;
    //   console.log(tempFilePath);
    //   console.log(vDuration + "这是voice的时长");

    //   var list = that.data.messageList;
    //   var temp = {
    //     userImgSrc: '../../image/chat/extra/close_chat.png',
    //     voiceSrc: tempFilePath,
    //     voiceTime: vDuration,
    //     dataTime: utils.formatTime(new Date()),
    //     msg_type: 'voice',
    //     type: 1
    //   };
    //   list.push(temp);
    //   that.setData({
    //     messageList: list,
    //   })
    // });
    // chatInput.setVoiceRecordStatusListener(function (status) {
    //   switch (status) {
    //     case chatInput.VRStatus.START: //开始录音

    //       break;
    //     case chatInput.VRStatus.SUCCESS: //录音成功

    //       break;
    //     case chatInput.VRStatus.CANCEL: //取消录音

    //       break;
    //     case chatInput.VRStatus.SHORT: //录音时长太短

    //       break;
    //     case chatInput.VRStatus.UNAUTH: //未授权录音功能

    //       break;
    //     case chatInput.VRStatus.FAIL: //录音失败(已经授权了)

    //       break;
    //   }
    // })
  },
  extraButton: function () {
    let that = this;
    // chatInput.clickExtraListener(function (e) {
    //   console.log(e);
    //   let itemIndex = parseInt(e.currentTarget.dataset.index);
    //   if (itemIndex === 2) {
    //     that.myFun();
    //     return;
    //   }
    //   wx.chooseImage({
    //     count: 1, // 默认9
    //     sizeType: ['compressed'],
    //     sourceType: itemIndex === 0 ? ['album'] : ['camera'],
    //     success: function (res) {
    //       let tempFilePath = res.tempFilePaths[0];
    //       console.log(tempFilePath);

    //       var list = that.data.messageList;
    //       var temp = {
    //         dataTime: utils.formatTime(new Date()),
    //         userImgSrc: '../../image/chat/extra/close_chat.png',
    //         sendImgSrc: tempFilePath,
    //         msg_type: 'img',
    //         type: 1
    //       };
    //       list.push(temp);
    //       that.setData({
    //         messageList: list,
    //       })


    //     }
    //   });

    // });
    // chatInput.setExtraButtonClickListener(function (dismiss) {
    //   console.log('Extra弹窗是否消息', dismiss);
    // })
  },


  resetInputStatus: function () {
    // chatInput.closeExtraView();
  },
  // //播放录音
  // playRecord: function (e) {
  //   let _this = this;
  //   // wx.playVoice({
  //   //   filePath: voiceSrc // src可以是录音文件临时路径
  //   // })
  //   console.log(e)
  //   console.log(_this)
  // },
  //删除单条消息
  delMsg: function (e) {
    var that = this;
    var magIdx = parseInt(e.currentTarget.dataset.index);
    var list = that.data.messageList;

    wx.showModal({
      title: '提示',
      content: '确定删除此消息吗？',
      success: function (res) {
        if (res.confirm) {
          console.log(e);
          list.splice(magIdx, 1);
          that.setData({
            messageList: list,
          });
          // wx.showToast({
          //   title: '删除成功',
          //   mask: true,
          //   icon: 'none',
          // })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })



  },
  //点击图片 预览大图
  seeBigImg: function (e) {
    var that = this;
    var idx = parseInt(e.currentTarget.dataset.index);
    var src = that.data.messageList[idx].payload.imageInfoArray[0].url;
    console.log(src)
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
});