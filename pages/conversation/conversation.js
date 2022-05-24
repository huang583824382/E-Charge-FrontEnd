// eslint-disable-next-line no-undef
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userVisible: false,
    value: '',
    userFilter: '',
    isEmpty: true,
    conversationList: [],
    showSelectTag: false,
    array: [{
        name: '发起会话'
      },
      {
        name: '发起群聊'
      },
      {
        name: '加入群聊'
      },
    ],
    index: Number,
    unreadCount: 0,
    conversationInfomation: {},
    transChenckID: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 登入后拉去会话列表
    wx.tim.on(wx.TIM.EVENT.CONVERSATION_LIST_UPDATED, this.onConversationListUpdated, this);

  },
  onShow() {
    console.log("conversation onshow")
    this.getConversationList();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    wx.tim.off(wx.TIM.EVENT.CONVERSATION_LIST_UPDATED, this.onConversationListUpdated);
  },
  // 跳转到子组件需要的参数
  handleRoute(event) {
    // const flagIndex = this.data.conversationList.findIndex(item => item.conversationID === event.currentTarget.id);
    // this.setData({
    //   index: flagIndex,
    // });
    // this.getConversationList();
    // this.data.conversationInfomation = { conversationID: event.currentTarget.id,
    //   unreadCount: this.data.conversationList[this.data.index].unreadCount };
    // const url = `../../TUI-Chat/chat?conversationInfomation=${JSON.stringify(this.data.conversationInfomation)}`;
    // wx.navigateTo({
    //   url,
    // });
    console.log(this.data.conversationList)
    wx.navigateTo({
      url: '/pages/chat/chat?conversationID=' + this.data.conversationList[event.currentTarget.dataset.index].conversationID
    })
  },
  // 更新会话列表
  onConversationListUpdated(event) {
    for (item in event.data) {}
    this.setData({
      conversationList: event.data,
    });
  },
  // 获取会话列表
  getConversationList() {
    console.log("conversation list")
    wx.tim.getConversationList().then((imResponse) => {
      console.log(imResponse)
      for (var i = 0; i < imResponse.data.conversationList.length; i++) {
        console.log(imResponse.data.conversationList[i].userProfile.nick)
        if (imResponse.data.conversationList[i].userProfile.nick.indexOf(this.data.userFilter) != -1 || imResponse.data.conversationList[i].userProfile.userID.indexOf(this.data.userFilter) != -1) {
          imResponse.data.conversationList[i].filter = true
        } else {
          imResponse.data.conversationList[i].filter = false
        }
      }
      console.log(imResponse.data.conversationList)
      this.setData({
        conversationList: imResponse.data.conversationList,
        isEmpty: imResponse.data.conversationList.length == 0
      });
    });
  },
  // 展示发起会话/发起群聊/加入群聊
  showSelectedTag() {
    this.setData({
      showSelectTag: !this.data.showSelectTag,
    });
  },
  // 点击事件跳转
  handleOnTap(event) {
    this.setData({
      showSelectTag: false,
    }, () => {
      switch (event.currentTarget.dataset.name) {
        case '发起会话':
          this.$createConversation();
          break;
        case '发起群聊':
          this.$createGroup();
          break;
        case '加入群聊':
          this.$joinGroup();
          break;
        default:
          break;
      }
    });
  },
  // 返回主页
  goHomePage() {
    // wx.navigateTo 不能跳转到 tabbar 页面，使用 wx.switchTab 代替
    wx.switchTab({
      url: '../../../../pages/TUI-Index/index',
    });
  },
  // 点击空白区域关闭showMore弹窗
  handleEditToggle() {
    this.setData({
      showSelectTag: false,
    });
  },
  // 跳转事件路径
  $createConversation() {
    wx.navigateTo({
      url: '../create-conversation/create',
    });
  },
  $createGroup() {
    wx.navigateTo({
      url: '../../TUI-Group/create-group/create',
    });
  },
  $joinGroup() {
    wx.navigateTo({
      url: '../../TUI-Group/join-group/join',
    });
  },
  transCheckID(event) {
    this.setData({
      transChenckID: event.detail.checkID,
    });
  },
  onClickSearch() {
    console.log(this.data.value)
    wx.tim.getUserProfile({
      userIDList: [this.data.value],
    }).then((res) => {
      console.log(res)
      if (res.data.length > 0) {
        this.setData({
          searchUser: res.data[0],
          userVisible: true
        })
      } else {
        wx.showToast({
          title: '用户不存在',
          icon: 'error',
        });
      }

    })
  },
  filterConversation() {
    for (var i = 0; i < this.data.conversationList.length; i++) {
      console.log(this.data.conversationList[i].userProfile.nick)
      if (this.data.conversationList[i].userProfile.nick.indexOf(this.data.userFilter) != -1 || this.data.conversationList[i].userProfile.userID.indexOf(this.data.userFilter) != -1) {
        this.data.conversationList[i].filter = true
      } else {
        this.data.conversationList[i].filter = false
      }
    }
    this.setData({
      conversationList: this.data.conversationList
    })
  },
  onVisibleChange() {
    this.setData({
      userVisible: !this.data.userVisible
    })
  },
  openConversation() {
    console.log(this.data.searchUser)
    wx.navigateTo({
      url: '/pages/chat/chat?conversationID=C2C' + this.data.searchUser.userID
    })
  },
  onValueChange() {
    // var str = '123'
    // console.log(str.indexOf(''), str.indexOf('2'))
    this.setData({
      userFilter: this.data.value
    })
    console.log(this.data.userFilter)
    this.filterConversation()
  }
});