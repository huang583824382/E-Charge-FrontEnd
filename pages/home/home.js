// import {
//   fetchHome
// } from '../../services/home/home';
// import {
//   fetchGoodsList
// } from '../../services/good/fetchGoods';
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    // imgSrcs: [],
    // tabList: [],
    list: [
      [],
      []
    ], // 0: goods list, 1: tasks list
    //goodsList: [],
    //tasksList: [],
    listLoadStatus: [0, 0],
    tabIndex: 0,
    //goodsListLoadStatus: 0,
    //tasksListLoadStatus: 0,
    pageLoading: false,
    // current: 1,
    // autoplay: true,
    // duration: 500,
    // interval: 5000,
    // navigation: {
    //   type: 'dots'
    // },
    // fabButton: {
    //   openType: 'getPhoneNumber',
    // },
  },

  goodListPagination: {
    index: 0,
    num: 20,
  },

  // privateData: {
  //   tabIndex: 0,
  // },

  // handleClick(e) {
  //   console.log(e);
  // },

  onShow() {
    this.getTabBar().init();
  },

  onLoad() {
    this.init();
  },

  // 到达页底，获取新一批商品/任务
  onReachBottom() {
    if (this.data.listLoadStatus[this.data.tabIndex] === 0) {
      this.loadGoodsList();
    }
  },

  // 下拉，刷新页面
  onPullDownRefresh() {
    this.init();
  },

  init() {
    const app = getApp()
    this.loadHomePage();
  },

  // 加载主页
  loadHomePage() {
    wx.stopPullDownRefresh();

    this.setData({
      pageLoading: true,
    });
    this.loadGoodsList(true).then(() => {
      this.setData({
        pageLoading: false
      })
    });
    // fetchHome().then(({
    //   swiper,
    //   tabList
    // }) => {
    //   this.setData({
    //     tabList,
    //     imgSrcs: swiper,
    //     pageLoading: false,
    //   });
    //   this.loadGoodsList(true);
    // });
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

  // 切换tab栏
  tabChangeHandle(e) {
    //console.log(e.detail.value);
    this.setData({
      tabIndex: e.detail.value
    }, () => {
      this.loadGoodsList(true);
    });
  },

  // 点击重新加载后，再次获取列表
  onReTry() {
    this.loadGoodsList();
  },

  async fetchGoodsList(type = 0, pageSize = 20) {
    console.log(type);
    // if (config.useMock) {
    //   return mockFetchGoodsList(pageIndex, pageSize);
    // }
    return new Promise((resolve, reject) => {
      console.log(getApp().globalData.session_key);
      // 根据类型决定目标url
      var url = getApp().globalData.URL + (type === 0 ? "/list/goods" : "/list/tasks");
      wx.request({
        url: url,
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          token: getApp().globalData.session_key, // token
          size: pageSize, // 商品/任务数量
        },
        success: (res) => {
          if (res.statusCode === 200) {
            console.log(res)
            if (res.data.length === 0) {
              reject();
            } else {
              resolve(res.data);
            }
          } else {
            reject();
          }
        }
      });
    });
  },

  // 异步获取并加载列表
  async loadGoodsList(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    }
    // 加载状态：加载中
    this.setLoadStatus(1);

    const pageSize = this.goodListPagination.num;
    // let pageIndex =
    //   this.privateData.tabIndex * pageSize + this.goodListPagination.index + 1;
    // if (fresh) {
    //   pageIndex = 0;
    // }

    // 获取列表
    try {
      const nextList = await this.fetchGoodsList(this.data.tabIndex, pageSize);
      var newList = this.data.list;
      // 处理数据格式
      if (this.data.tabIndex === 0) {
        nextList.forEach((element, index) => {
          //console.log(element);
          //element.figureUrls = "";
          console.log(getApp().globalData.IMG_SERVER + "/NoPic.jpg");
          element.thumb = (element.figureUrls === "") ? (getApp().globalData.IMG_SERVER + "/NoPic.jpg") : element.figureUrls.split(";")[0];
          element.images = element.figureUrls.split(";");
        });
      }
      // 更新数据和加载状态
      newList[this.data.tabIndex] = fresh ? nextList :
        this.data.list[this.data.tabIndex].concat(nextList);
      var newLoadStatus = this.data.listLoadStatus;
      newLoadStatus[this.data.tabIndex] = 0;
      this.setData({
        list: newList,
        // goodsList: fresh ? nextList : this.data.goodsList.concat(nextList),
        // tasksList: fresh ? nextList : this.data.tasksList.concat(nextList),
        listLoadStatus: newLoadStatus
      });

      //this.goodListPagination.index = pageIndex;
      //this.goodListPagination.num = pageSize;
    } catch (err) {
      console.log(err);
      // 加载状态：加载失败
      this.setLoadStatus(3);
    }
  },

  // 设置加载状态
  setLoadStatus(status) {
    var newLoadStatus = this.data.listLoadStatus;
    newLoadStatus[this.data.tabIndex] = status;
    this.setData({
      listLoadStatus: newLoadStatus
    });
  },

  // 提示信息
  showInfo(suc, msg) {
    Toast({
      context: this,
      selector: '#home-t-toast',
      message: msg,
      theme: suc ? 'success' : 'fail',
    });
  },

  // 点击进入商品详情页
  listClickHandle(e) {
    // const {
    //   index
    // } = e.detail.index;

    // const {
    //   spuId
    // } = this.data.list[this.data.tabIndex][index].itemId;

    const spuId = e.detail.goods.itemId;

    wx.navigateTo({
      url: `/pages/goods/details/index?spuId=${spuId}`,
    });
  },

  // taskListClickHandle(e) {
  //   const {
  //     index
  //   } = e.detail;
  //   const {
  //     spuId
  //   } = this.data.tasksList[index];
  //   wx.navigateTo({
  //     url: `/pages/goods/details/index?spuId=${spuId}`,
  //   });
  // },

  // 点击搜索，前往结果页
  onClickSearch(e) {
    const comp = this.selectComponent('#home-search').__data__;
    const search = comp.value;
    const type = this.data.tabIndex
    if (search.length !== 0) {
      wx.navigateTo({
        url: `/pages/goods/result/index?searchValue=${search}&type=${type}`,
      })
    } else {
      this.showInfo(false, '请输入关键词');
    }
  }

  // goodListAddCartHandle() {
  //   Toast({
  //     context: this,
  //     selector: '#t-toast',
  //     message: '点击加入购物车',
  //   });
  // },

  // navToSearchPage() {
  //   wx.navigateTo({
  //     url: '/pages/goods/search/index'
  //   });
  // },

  // navToActivityDetail({
  //   detail
  // }) {
  //   const {
  //     index: promotionID = 0
  //   } = detail || {};
  //   wx.navigateTo({
  //     url: `/pages/promotion-detail/index?promotion_id=${promotionID}`,
  //   });
  // },
});