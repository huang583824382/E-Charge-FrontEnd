// pages/publish/publish.js
import Toast from 'tdesign-miniprogram/toast/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    submitActive_goods: true,
    submitActive_tasks: false,
    picker2Visible: false,
    selectedCityValue2: '广州',
    // label: [{
    //     label: 'food',
    //     value: '食品'
    //   },
    //   {
    //     label: '工具',
    //     value: '工具'
    //   },
    //   {
    //     label: '药品',
    //     value: '药品'
    //   },
    //   {
    //     label: '代购',
    //     value: '代购'
    //   },
    //   {
    //     label: '帮忙',
    //     value: '帮忙'
    //   },
    // ],
    goods_data: {
      title: "",
      detail: "",
      price: null,
      tags: [],
    },
    tasks_data: {
      title: "",
      detail: "",
      price: null,
      tags: [],
      location: "",
      deadline: "",
    },
    uploadImg: false,
    allSent: false,
    originFiles_goods: [],
    originFiles_tasks: [],
    gridConfig: {
      column: 4,
      width: 160,
      height: 160,
    },
    visible: false,
    inputTagValue: '',
  },
  // onColumnChange(e) {
  //   console.log('column change:', e.detail);
  // },

  // onClickPicker(e) {
  //   const {
  //     index
  //   } = e?.currentTarget?.dataset;

  //   this.setData({
  //     [`picker${index}Visible`]: true,
  //   });
  // },

  // onPickerChange(e) {
  //   console.log('picker change:', e.detail);
  // },
  // onPicker2Confirm(e) {
  //   console.log('picker2 confirm:', e.detail);
  //   this.setData({
  //     picker2Visible: false,
  //     selectedYearsWithSeason: e.detail.value[0]?.value,
  //     selectedSeason: e.detail.value[1]?.value,
  //   });
  // },
  // onPicker2Cancel() {
  //   console.log('picker2 cancel:');
  //   this.setData({
  //     picker2Visible: false,
  //   });
  // },

  getUnread(event) {
    var unread = 0
    for (var i = 0; i < event.data.length; i++) {
      unread += event.data[i].unreadCount
    }
    this.setData({
      unreadNum: unread
    })
    console.log("get unread")
  },

  // getRandFileName(filePath) {
  //   const extIndex = filePath.lastIndexOf('.');
  //   const extName = extIndex === -1 ? '' : filePath.substr(extIndex);
  //   return parseInt(`${Date.now()}${Math.floor(Math.random() * 900 + 100)}`, 10).toString(36) + extName;
  // },
  handleSuccess_goods(e) {
    const {
      files //这里传的是列表
    } = e.detail;

    console.log(files);
    this.setData({
      originFiles_goods: files,
      uploadImg: true
    });
    console.log(files[0].url);
  },
  handleRemove_goods(e) {
    const {
      index
    } = e.detail;
    const {
      originFiles_goods
    } = this.data;
    originFiles_goods.splice(index, 1);
    this.setData({
      originFiles_goods,
    });
  },
  handleSuccess_tasks(e) {
    const {
      files
    } = e.detail;
    this.setData({
      originFiles_tasks: files,
      uploadImg: true
    });
  },
  handleRemove_tasks(e) {
    const {
      index
    } = e.detail;
    const {
      originFiles_tasks
    } = this.data;
    originFiles_tasks.splice(index, 1);
    this.setData({
      originFiles_tasks,
    });
  },

  // 进入会话界面
  enterChatRoom() {
    console.log("enter chat room");
    // wx.navigateTo({
    //   url: `/pages/message-list/index`
    // });
    wx.navigateTo({
      url: '/pages/conversation/conversation'
    })
  },

  onPicker1Confirm(e) {
    console.log('picker1 confirm:', e.detail);
    this.setData({
      selectedCityValue: e.detail.value?.value,
    });
  },

  onGoodTitleChange(e) {
    this.setData({
      'goods_data.title': e.detail.value
    });
  },
  onGoodDetailChange(e) {
    this.setData({
      'goods_data.detail': e.detail.value
    });
  },
  onGoodPriceChange(e) {
    this.setData({
      'goods_data.price': e.detail.value
    });
  },
  onTaskTitleChange(e) {
    this.setData({
      'tasks_data.title': e.detail.value
    });
  },
  onTaskDetailChange(e) {
    this.setData({
      'tasks_data.detail': e.detail.value
    });
  },
  onTaskPriceChange(e) {
    this.setData({
      'tasks_data.price': e.detail.value
    });
  },
  onTaskPlaceChange(e) {
    this.setData({
      'tasks_data.location': e.detail.value
    });
  },
  onTaskTimeChange(e) {
    this.setData({
      'tasks_data.deadline': e.detail.value
    });
  },

  onTagChange(e) {
    console.log(e);
    this.setData({
      inputTagValue: e.detail.value
    });
  },

  addTag(e) {
    console.log(e);
    this.setData({
      visible: true
    });
  },

  confirmHandle(e) {
    console.log(e);
    const publishTab = this.selectComponent('#publish-tab');
    console.log(publishTab)
    const idx = publishTab.__data__.currentIndex;

    if (this.data.inputTagValue.length > 10) {
      this.showInfo(false, '标签长度不能超过10个字符');
      return;
    }
    var tags = idx == 0 ? this.data.goods_data.tags : this.data.tasks_data.tags;
    tags.push(this.data.inputTagValue);
    if (idx == 0) {
      this.setData({
        'goods_data.tags': tags,
        visible: false,
        inputTagValue: '',
      });
    } else {
      this.setData({
        'tasks_data.tags': tags,
        visible: false,
        inputTagValue: '',
      });
    }
  },

  cancelHandle(e) {
    console.log(e);
    this.setData({
      inputTagValue: '',
      visible: false,
    })
  },

  removeGoodTag(e) {
    console.log(e);
    var idTokens = e.target.id.split("-");
    var idx = idTokens[idTokens.length - 1];
    var tags = this.data.goods_data.tags;
    tags.splice(idx, 1);
    this.setData({
      'goods_data.tags': tags
    });
  },

  removeTaskTag(e) {
    console.log(e);
    var idTokens = e.target.id.split("-");
    var idx = idTokens[idTokens.length - 1];
    var tags = this.data.tasks_data.tags;
    tags.splice(idx, 1);
    this.setData({
      'tasks_data.tags': tags
    });
  },


  // 上传图片
  onTapGoodBtn(e) {
    console.log("hhh");
    /* 检查数据格式 */
    const app = getApp();
    // 检查标题格式
    if (this.data.goods_data.title.length < 3 || this.data.goods_data.title.length > 8) {
      this.showInfo(false, "商品标题长度不合法！");
      return;
    }
    // 检查详细信息
    else if (this.data.goods_data.detail.length < 1) {
      this.showInfo(false, "详细介绍不能为空！");
      return;
    } else if (this.data.goods_data.detail.length > 200) {
      this.showInfo(false, "详细介绍不能超过两百字！");
      return;
    } else if (this.data.goods_data.price <= 0) {
      this.showInfo(false, "请不要白送哈，对方非小学生");
      return;
    } else if (this.data.goods_data.price >= 1000000) {
      this.showInfo(false, "请不要过分贵了，对方不是在买房");
      return;
    }
    // 检查是否有上传图片
    else if (this.data.uploadImg === false) {
      this.showInfo(false, "请至少上传一张图片作为封面！");
      return;
    }
    console.log(this.data.uploadImg);
    /* 格式合法，组装数据，发送请求 */

    // 发送请求
    var item_id = 0;
    var publishPromise = new Promise((resolve, reject) => {
      if (this.data.uploadImg === true) {
        // 有传过就上传描述的图片
        console.log(app.globalData.session_key);
        wx.uploadFile({
          url: app.globalData.URL + '/commodity/publish/first',
          filePath: this.data.originFiles_goods[0].url,
          name: 'publish',
          formData: {
            session_key: app.globalData.session_key,
            title: this.data.goods_data.title,
            publishImage: this.data.originFiles_goods[0].url,
            price: parseFloat(this.data.goods_data.price),
            description: this.data.goods_data.detail,
            tags: this.data.goods_data.tags.join(';'),
            place: null,
            deadline: null,
            type: 0
          },
          success: (res) => {
            if (res.statusCode === 200) {
              console.log(res);
              if (res.data.info === "unexpected error") {
                this.showInfo(false, "传输失败，人品不好吧！");
                return;
              } else if (res.data.info === "same title") {
                this.showInfo(false, "起名都能重");
                return;
              } else {
                console.log(555);
                var resData = JSON.parse(res.data);
                item_id = resData.itemId;
                console.log(resData);
                resolve();
              }
            }
          },
          fail: (res) => {
            console.log(res);
            this.showInfo(false, "出错了，校网又崩了吧")
            return;
          }
        });
      }
    })

    var i = 1;
    publishPromise.then(() => {
      console.log(item_id);
      for (i = 1; i < this.data.originFiles_goods.length; i++) {
        wx.uploadFile({
          url: app.globalData.URL + '/commodity/publish/second',
          filePath: this.data.originFiles_goods[i].url,
          name: 'publish',
          formData: {
            session_key: app.globalData.session_key,
            publishImage: this.data.originFiles_goods[i].url,
            item_id: item_id
          },
          success: (res) => {
            if (res.statusCode === 200) {
              console.log(res);
              if (res.data.info === "unexpected error") {
                this.showInfo(false, "传输失败，人品不好吧！");
                return;
              } else if (res.data.info === "same title") {
                this.showInfo(false, "起名都能重");
                return;
              } else {
                console.log(555);
                //resolve();
              }
            }
          },
          fail: (res) => {
            console.log(res);
            this.showInfo(false, "出错了，校网又崩了吧")
            return;
          }

        })

      }
    })

    // 请求完成后根据结果作出响应
    publishPromise.then(() => {
      this.setData({
        allSent: true
      });
      this.checkAndSwitchTab(true, "发布成功！");
    })
  },


  onTapTaskBtn(e) {
    console.log("hhh");
    /* 检查数据格式 */
    const app = getApp();
    // 检查标题格式
    if (this.data.tasks_data.title.length < 3 || this.data.tasks_data.title.length > 8) {
      this.showInfo(false, "商品标题长度不合法！");
      return;
    }
    // 检查详细信息
    else if (this.data.tasks_data.detail.length < 1) {
      this.showInfo(false, "需求介绍不能为空！");
      return;
    } else if (this.data.tasks_data.detail.length > 200) {
      this.showInfo(false, "需求介绍不能超过两百字！");
      return;
    } else if (this.data.tasks_data.price <= 0) {
      this.showInfo(false, "请不要让别人打白工");
      return;
    } else if (this.data.tasks_data.price >= 1000000) {
      this.showInfo(false, "请不要过分贵了，别人不敢接");
      return;
    }
    console.log(this.data.uploadImg);
    /* 格式合法，组装数据，发送请求 */

    // 发送请求
    var item_id = 0;
    var publishPromise;
    if (this.data.uploadImg === true) {
      publishPromise = new Promise((resolve, reject) => {
        // 有传过就上传描述的图片
        console.log(app.globalData.session_key);
        wx.uploadFile({
          url: app.globalData.URL + '/commodity/publish/first',
          filePath: this.data.originFiles_tasks[0].url,
          name: 'publish',
          formData: {
            session_key: app.globalData.session_key,
            title: this.data.tasks_data.title,
            publishImage: this.data.originFiles_tasks[0].url,
            price: parseFloat(this.data.tasks_data.price),
            description: this.data.tasks_data.detail,
            tags: this.data.tasks_data.tags.join(';'),
            place: this.data.tasks_data.location,
            deadline: this.data.tasks_data.deadline,
            type: 1
          },
          success: (res) => {
            if (res.statusCode === 200) {
              console.log(res);
              if (res.data.info === "unexpected error") {
                this.showInfo(false, "传输失败，人品不好吧！");
                return;
              } else if (res.data.info === "same title") {
                this.showInfo(false, "起名都能重");
                return;
              } else {
                console.log(555);
                console.log(res)
                var resData = JSON.parse(res.data);
                item_id = resData.itemId;
                console.log(resData);
                resolve();
              }
            }
          },
          fail: (res) => {
            console.log(res);
            this.showInfo(false, "出错了，校网又崩了吧")
            return;
          }
        });
      })

      var i = 1;
      publishPromise.then(() => {
        console.log(item_id);
        for (i = 1; i < this.data.originFiles_tasks.length; i++) {
          wx.uploadFile({
            url: app.globalData.URL + '/commodity/publish/second',
            filePath: this.data.originFiles_tasks[i].url,
            name: 'publish',
            formData: {
              session_key: app.globalData.session_key,
              publishImage: this.data.originFiles_tasks[i].url,
              item_id: item_id
            },
            success: (res) => {
              if (res.statusCode === 200) {
                console.log(res);
                if (res.data.info === "unexpected error") {
                  this.showInfo(false, "传输失败，人品不好吧！");
                  return;
                } else if (res.data.info === "same title") {
                  this.showInfo(false, "起名都能重");
                  return;
                } else {
                  console.log(555);
                  //resolve();
                }
              }
            },
            fail: (res) => {
              console.log(res);
              this.showInfo(false, "出错了，校网又崩了吧")
              return;
            }
          })
        }
      })
    }
    // 无上传图片
    else {
      publishPromise = new Promise((resolve, reject) => {
        wx.request({
          url: app.globalData.URL + '/commodity/publish/no-pic',
          method: "POST",
          timeout: 500,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            session_key: app.globalData.session_key,
            title: this.data.tasks_data.title,
            price: parseFloat(this.data.tasks_data.price),
            description: this.data.tasks_data.detail,
            tags: this.data.tasks_data.tags.join(';'),
            place: this.data.tasks_data.location,
            deadline: this.data.tasks_data.deadline,
          },
          success: (res) => {
            if (res.statusCode === 200) {
              console.log(res);
              if (res.data.code === "verification error") {
                this.showInfo(false, "验证失败，请退出后重试！");
                return;
              } else if (res.data.code === "success") {
                resolve();
              }
            }
          },
          fail: (res) => {
            this.showInfo(false, "出错了，请稍后重试")
            return;
          }
        });

      })
    }
    // 请求完成后根据结果作出响应
    publishPromise.then(() => {
      this.setData({
        allSent: true
      });
      this.checkAndSwitchTab(true, "发布成功！");
    })
  },

  showInfo(suc, msg) {
    Toast({
      context: this,
      selector: '#publish-t-toast',
      message: msg,
      theme: suc ? 'success' : 'fail',
    });
  },

  reset() {
    this.setData({
      goods_data: {
        title: "",
        detail: "",
        price: null,
        tags: [],
      },
      tasks_data: {
        title: "",
        detail: "",
        price: null,
        tags: [],
      },
      uploadImg: false,
      allSent: false,
      originFiles_goods: [],
      originFiles_tasks: [],
    });
  },

  checkAndSwitchTab() {
    // 数据全部传输完，说明可以跳转
    if (this.data.allSent === true) {
      // 延时跳转
      this.reset();
      this.showInfo(true, "发布成功！");
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/home/home'
        });
      }, 300)
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.tim.on(wx.TIM.EVENT.CONVERSATION_LIST_UPDATED, this.getUnread);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getTabBar().init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    wx.tim.off(wx.TIM.EVENT.CONVERSATION_LIST_UPDATED, this.getUnread);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})