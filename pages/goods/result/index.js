/* eslint-disable no-param-reassign */
// import {
//   getSearchResult
// } from '../../../services/good/fetchSearchResult';
import Toast from 'tdesign-miniprogram/toast/index';

const initFilters = {
  overall: 1,
  sorts: '',
};

Page({
  data: {
    goodsList: [],
    sorts: '',
    overall: 1,
    show: false,
    type: 0,
    // minVal: '',
    // maxVal: '',
    // minSalePriceFocus: false,
    // maxSalePriceFocus: false,
    filter: initFilters,
    hasLoaded: false,
    keywords: '',
    loadMoreStatus: 0,
    loading: true,
  },

  total: 0,
  //pageNum: 1,
  pageSize: 30,

  onLoad(options) {
    const app = getApp();
    console.log(options);
    const {
      searchValue = '', type = '',
    } = options || {};

    // 设置页标题
    wx.setNavigationBarTitle({
      title: '搜索' + ((type == 0) ? '商品' : '任务'),
    })

    this.setData({
        keywords: searchValue,
        type: type,
      },
      () => {
        this.init(true);
      },
    );
  },

  // generalQueryData(reset = false) {
  //   const {
  //     filter,
  //     keywords,
  //     // minVal,
  //     // maxVal
  //   } = this.data;
  //   const {
  //     pageNum,
  //     pageSize
  //   } = this;
  //   const {
  //     sorts,
  //     overall
  //   } = filter;
  //   const params = {
  //     sort: 0, // 0 综合，1 价格
  //     pageNum: 1,
  //     pageSize: 30,
  //     keyword: keywords,
  //   };

  //   if (sorts) {
  //     params.sort = 1;
  //     params.sortType = sorts === 'desc' ? 1 : 0;
  //   }
  //   if (overall) {
  //     params.sort = 0;
  //   } else {
  //     params.sort = 1;
  //   }
  //   // params.minPrice = minVal ? minVal * 100 : 0;
  //   // params.maxPrice = maxVal ? maxVal * 100 : undefined;
  //   if (reset) return params;
  //   return {
  //     ...params,
  //     pageNum: pageNum + 1,
  //     pageSize,
  //   };
  // },

  // 提示信息
  showInfo(suc, msg) {
    Toast({
      context: this,
      selector: '#result-t-toast',
      message: msg,
      theme: suc ? 'success' : 'fail',
    });
  },

  // 请求对应项列表
  async getSearchResult(type = 0, pageSize = 20, keywords = "", order = 0, lastId = -1) {
    return new Promise((resolve, reject) => {
      console.log(getApp().globalData.session_key);
      // 根据类型决定目标url
      var url = getApp().globalData.URL + "/list/search";
      console.log(url);
      wx.request({
        url: url,
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          token: getApp().globalData.session_key, // token
          type: type, // 商品/任务
          size: pageSize, // 商品/任务数量
          search: keywords, // 检索信息
          order: order, // 顺序, 0: 随机；1：升序；2：降序；3：时间倒序
          lastId: lastId, // 当前最后商品的id，用于划界
        },
        success: (res) => {
          if (res.statusCode === 200) {
            console.log(res);
            resolve(res.data);
          } else {
            console.log(res);
            resolve({
              data: {
                code: 'fail'
              }
            });
          }
        },
        fail: (res) => {
          console.log(res);
          resolve({
            data: {
              code: 'fail'
            }
          });
        }
      });
    });
  },

  // 获取新的一组发布项数据
  async init(reset = true) {
    const {
      loadMoreStatus,
      goodsList = []
    } = this.data;
    // TODO: 设置传输的数据
    // const params = this.generalQueryData(reset);

    if (loadMoreStatus !== 0) return;
    this.setData({
      loadMoreStatus: 1,
      loading: true,
    });
    try {
      const pageSize = (this.data.type == 0 ? 6 : 8);
      // 顺序, 1：升序；2：降序；3：时间倒序
      const order = (this.data.overall === 1 ? 3 : (this.data.sorts === "desc" ? 2 : 1));
      const lastId = (reset || this.data.goodsList.length === 0) ? -1 : this.data.goodsList[this.data.goodsList.length - 1].itemId;
      console.log(lastId);
      // TODO: 获取结果
      const res = await this.getSearchResult(this.data.type, pageSize, this.data.keywords, order, lastId);
      console.log(222);
      console.log(res);
      const code = res.code;
      const data = res;
      if (code.toUpperCase() === 'SUCCESS') {
        const {
          list,
          totalCount = 0,
          pubUser
        } = data;
        console.log(list);
        if (totalCount === 0 && reset) {
          this.total = totalCount;
          this.setData({
            emptyInfo: {
              tip: '抱歉，未找到相关商品',
            },
            hasLoaded: true,
            loadMoreStatus: 0,
            loading: false,
            goodsList: [],
          });
          return;
        }

        // 处理数据格式
        var nextList = list;
        nextList.forEach((element, index) => {
          if (this.data.type == 0) {
            element.thumb = (element.figureUrls === "") ? (getApp().globalData.IMG_SERVER + "/NoPic.jpg") : element.figureUrls;
          } else {
            element.thumb = element.figureUrls;
            element.userIconUrl = pubUser[index].iconUrl;
            element.uname = pubUser[index].name;
          }
          element.images = element.figureUrls.split(";");
        });

        const _goodsList = reset ? nextList : goodsList.concat(nextList);
        // _goodsList.forEach((v) => {
        //   v.tags = v.spuTagList.map((u) => u.title);
        //   v.hideKey = {
        //     desc: true
        //   };
        // });
        const _loadMoreStatus = _goodsList.length === totalCount ? 2 : 0;
        //this.pageNum = params.pageNum || 1;
        if (reset) {
          this.total = totalCount;
        }

        console.log(_goodsList);

        this.setData({
          goodsList: _goodsList,
          loadMoreStatus: _loadMoreStatus,
        });
      } else {
        this.setData({
          loading: false,
        });
        this.showInfo(false, '查询失败，请稍候重试');
      }
    } catch (error) {
      this.setData({
        loading: false,
      });
    }
    this.setData({
      hasLoaded: true,
      loading: false,
    });
  },

  // handleCartTap() {
  //   wx.switchTab({
  //     url: '/pages/cart/index',
  //   });
  // },

  handleSubmit(e) {
    const comp = this.selectComponent('#result-search').__data__;
    const search = comp.value;
    if (search.length !== 0) {
      this.setData({
          goodsList: [],
          loadMoreStatus: 0,
          keywords: search,
        },
        () => {
          this.init(true);
        },
      );
    } else { // 提示输入关键词
      this.showInfo(false, '请输入关键词');
    }
  },

  onReachBottom() {
    const {
      goodsList
    } = this.data;
    const {
      total = 0
    } = this;
    if (goodsList.length === total) {
      this.setData({
        loadMoreStatus: 2,
      });
      return;
    }
    this.init(false);
  },

  // handleAddCart() {
  //   Toast({
  //     context: this,
  //     selector: '#t-toast',
  //     message: '点击加购',
  //   });
  // },

  gotoGoodsDetail(e) {
    const {
      index
    } = e.detail;
    const {
      spuId
    } = this.data.goodsList[index];
    wx.navigateTo({
      url: `/pages/goods/details/index?spuId=${spuId}`,
    });
  },

  handleFilterChange(e) {
    console.log(e);
    const {
      overall,
      sorts
    } = e.detail;
    const {
      total
    } = this;
    const _filter = {
      sorts,
      overall,
    };
    this.setData({
      filter: _filter,
      sorts,
      overall,
    });

    //this.pageNum = 1;
    this.setData({
        goodsList: [],
        loadMoreStatus: 0,
      },
      () => {
        total && this.init(true);
      },
    );
  },

  // showFilterPopup() {
  //   this.setData({
  //     show: true,
  //   });
  // },

  // showFilterPopupClose() {
  //   this.setData({
  //     show: false,
  //   });
  // },

  // onMinValAction(e) {
  //   const {
  //     value
  //   } = e.detail;
  //   this.setData({
  //     minVal: value
  //   });
  // },

  // onMaxValAction(e) {
  //   const {
  //     value
  //   } = e.detail;
  //   this.setData({
  //     maxVal: value
  //   });
  // },

  // reset() {
  //   this.setData({
  //     minVal: '',
  //     maxVal: ''
  //   });
  // },

  // confirm() {
  //   const {
  //     minVal,
  //     maxVal
  //   } = this.data;
  //   let message = '';
  //   if (minVal && !maxVal) {
  //     message = `价格最小是${minVal}`;
  //   } else if (!minVal && maxVal) {
  //     message = `价格范围是0-${minVal}`;
  //   } else if (minVal && maxVal && minVal <= maxVal) {
  //     message = `价格范围${minVal}-${this.data.maxVal}`;
  //   } else {
  //     message = '请输入正确范围';
  //   }
  //   if (message) {
  //     Toast({
  //       context: this,
  //       selector: '#t-toast',
  //       message,
  //     });
  //   }
  //   this.pageNum = 1;
  //   this.setData({
  //       show: false,
  //       minVal: '',
  //       goodsList: [],
  //       loadMoreStatus: 0,
  //       maxVal: '',
  //     },
  //     () => {
  //       this.init();
  //     },
  //   );
  // },
});