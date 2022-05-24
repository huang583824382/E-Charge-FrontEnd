import {
  OrderStatus
} from '../config';
import {
  fetchOrders,
  fetchOrdersCount,
} from '../../../services/order/orderList';
import {
  cosThumb
} from '../../../utils/util';
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  page: {
    size: 5,
    num: 1,
  },

  data: {
    tabs: [{
        key: -1,
        text: '全部'
      },
      {
        key: OrderStatus.PENDING_PAYMENT,
        text: '待付款',
        info: ''
      },
      {
        key: OrderStatus.PENDING_RECEIPT,
        text: '待收货',
        info: ''
      },
      {
        key: OrderStatus.COMMENT,
        text: '待评价',
        info: ''
      },
      {
        key: OrderStatus.COMPLETE,
        text: '已完成',
        info: ''
      },
      {
        key: OrderStatus.REFUND,
        text: '退货',
        info: ''
      },
    ],
    curTab: -1,
    orderList: [],
    listLoading: 0,
    pullDownRefreshing: false,
    emptyImg: 'https://cdn-we-retail.ym.tencent.com/miniapp/order/empty-order-list.png',
    backRefresh: false,
    status: -1,
  },

  onLoad(query) {
    let status = parseInt(query.status);
    let customer = parseInt(query.customer)
    console.log("in order-list", status, customer)
    this.setData({
      isCustomer: customer
    })
    status = this.data.tabs.map((t) => t.key).includes(status) ? status : -1;
    this.init(status);
    this.pullDownRefresh = this.selectComponent('#wr-pull-down-refresh');
  },

  onShow() {
    this.onRefresh();
  },

  onReachBottom() {
    if (this.data.listLoading === 0) {
      this.getOrderList(this.data.curTab);
    }
  },

  onPageScroll(e) {
    this.pullDownRefresh && this.pullDownRefresh.onPageScroll(e);
  },

  onPullDownRefresh_(e) {
    const {
      callback
    } = e.detail;

    this.refreshList(this.data.curTab)
  },

  init(status) {
    console.log("status", status)
    status = status !== undefined ? status : this.data.curTab;
    this.setData({
      status,
    });
    this.refreshList(status);
  },

  getOrderList(statusCode = -1, reset = false) {
    const params = {
      parameter: {
        pageSize: this.page.size,
        pageNum: this.page.num,
      },
    };
    if (statusCode !== -1) params.parameter.orderStatus = statusCode;
    this.setData({
      listLoading: 1
    });
    return fetchOrders(params)
      .then((res) => {
        this.page.num++;
        let orderList = [];
        if (res && res.data && res.data.orders) {
          orderList = (res.data.orders || []).map((order) => {
            return {
              id: order.orderId,
              orderNo: order.orderNo,
              parentOrderNo: order.parentOrderNo,
              storeId: order.storeId,
              storeName: order.storeName,
              status: order.orderStatus,
              statusDesc: order.orderStatusName,
              amount: order.paymentAmount,
              totalAmount: order.totalAmount,
              logisticsNo: order.logisticsVO.logisticsNo,
              createTime: order.createTime,
              goodsList: (order.orderItemVOs || []).map((goods) => ({
                id: goods.id,
                thumb: cosThumb(goods.goodsPictureUrl, 70),
                title: goods.goodsName,
                skuId: goods.skuId,
                spuId: goods.spuId,
                specs: (goods.specifications || []).map(
                  (spec) => spec.specValue,
                ),
                price: goods.tagPrice ? goods.tagPrice : goods.actualPrice,
                num: goods.buyQuantity,
                titlePrefixTags: goods.tagText ? [{
                  text: goods.tagText
                }] : [],
              })),
              buttons: order.buttonVOs || [],
              groupInfoVo: order.groupInfoVo,
              freightFee: order.freightFee,
            };
          });
        }
        return new Promise((resolve) => {
          if (reset) {
            this.setData({
              orderList: []
            }, () => resolve());
          } else resolve();
        }).then(() => {
          this.setData({
            orderList: this.data.orderList.concat(orderList),
            listLoading: orderList.length > 0 ? 0 : 2,
          });
          console.log("orderList", this.data.orderList)
        });
      })
      .catch((err) => {
        this.setData({
          listLoading: 3
        });
        return Promise.reject(err);
      });
  },
  onReachBottom() {
    if (this.data.orderList.length > 0) {
      this.refreshList(this.data.curTab, this.data.orderList[this.data.orderList.length - 1].transaction_id)
    }


  },
  onReTryLoad() {
    this.getOrderList(this.data.curTab);
  },

  onTabChange(e) {
    const {
      value
    } = e.detail;
    this.setData({
      status: value,
    });
    this.refreshList(value);
  },

  getOrdersCount() {
    return fetchOrdersCount().then((res) => {
      const tabsCount = res.data || [];
      const {
        tabs
      } = this.data;
      tabs.forEach((tab) => {
        const tabCount = tabsCount.find((c) => c.tabType === tab.key);
        if (tabCount) {
          tab.info = tabCount.orderNum;
        }
      });
      this.setData({
        tabs
      });
    });
  },

  refreshList(status = -1, lastIndex = 0) {
    this.setData({
      pullDownRefreshing: true,
      orderList: this.data.orderList
    });
    let that = this
    var app = getApp()
    this.page = {
      size: this.page.size,
      num: 1,
    };
    if (lastIndex == 0) {
      this.setData({
        curTab: status,
        orderList: []
      });
    } else {
      this.setData({
        curTab: status,
      });
    }
    return wx.request({
      url: app.globalData.URL + '/trans/list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'token': app.globalData.session_key,
        lastIndex: lastIndex,
        state: status,
        isCustomer: this.data.isCustomer
      },
      success: (res) => {
        console.log("/trans/list", res)
        console.log("in refreshlist")
        var tmplist = []
        for (var i = 0; i < that.data.orderList.length; i++) {
          //删除index比lastindex大的东西
          console.log(that.data.orderList[i].transaction_id, lastIndex)
          if (that.data.orderList[i].transaction_id <= lastIndex) {
            tmplist.push(that.data.orderList[i])
          }
        }
        that.setData({
          orderList: tmplist.concat(res.data),
        })
        that.addBtnInfo()
        console.log(that.data.orderList)
      }
    })



    // return Promise.all([
    //   this.getOrderList(status, true),
    //   this.getOrdersCount(),
    // ]);
  },

  addBtnInfo() {
    if (this.data.isCustomer == 1) {
      console.log("addBtnInfo customer", this.data.orderList)
      for (let i = 0; i < this.data.orderList.length; i++) {
        switch (this.data.orderList[i].state) {
          case 0:
            this.data.orderList[i].btn1 = '已取消'
            this.data.orderList[i].btn2 = ''
            break
          case 1:
            this.data.orderList[i].btn1 = '付款'
            this.data.orderList[i].btn2 = '取消订单'
            break
          case 2:
            this.data.orderList[i].btn1 = '收货'
            this.data.orderList[i].btn2 = '退款'
            break
          case 3:
            this.data.orderList[i].btn1 = '评价'
            this.data.orderList[i].btn2 = '投诉'
            break
          case 4:
            this.data.orderList[i].btn1 = '已完成'
            this.data.orderList[i].btn2 = '投诉'
            break
          case 5:
            this.data.orderList[i].btn1 = '已退款'
            this.data.orderList[i].btn2 = ''
            break
        }
        this.setData({
          orderList: this.data.orderList
        })
      }
    } else {
      console.log("not customer", this.data.orderList)
      for (let i = 0; i < this.data.orderList.length; i++) {
        switch (this.data.orderList[i].state) {
          case 0:
            this.data.orderList[i].btn1 = '已取消'
            this.data.orderList[i].btn2 = ''
            break
          case 1:
            this.data.orderList[i].btn1 = '提醒付款'
            this.data.orderList[i].btn2 = '取消订单'
            break
          case 2:
            this.data.orderList[i].btn1 = '提醒收货'
            this.data.orderList[i].btn2 = '退款'
            break
          case 3:
            this.data.orderList[i].btn1 = '提醒评价'
            this.data.orderList[i].btn2 = '投诉'
            break
          case 4:
            this.data.orderList[i].btn1 = '已完成'
            this.data.orderList[i].btn2 = '投诉'
            break
          case 5:
            this.data.orderList[i].btn1 = '已退款'
            this.data.orderList[i].btn2 = ''
            break
        }
        this.setData({
          orderList: this.data.orderList
        })
      }
    }

    // let that = this
    // let tmpdata = this.data.orderList
    // for (var item in tmpdata) {
    //   console.log("in for", item)
    //   // let tmpState = tmpdata[i].state

    // }
    // this.setData({
    //   orderList: tmpdata
    // })
    // console.log("finish add btn", that.data.orderList)
  },

  onRefresh() {
    this.refreshList(this.data.curTab);
  },
  btn1Tap(e) {
    let app = getApp()
    let that = this
    console.log("btn1tap", e.currentTarget.dataset.order.state)
    if (e.currentTarget.dataset.order.state == 1) {
      wx.navigateTo({
        url: `/pages/payment/payment?transactionID=${e.currentTarget.dataset.order.transaction_id}`,
      })
    } else if (e.currentTarget.dataset.order.state == 2) {
      wx.request({
        url: app.globalData.URL + '/trans/confirm',
        method: "POST",
        timeout: 500,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          token: app.globalData.session_key,
          transId: e.currentTarget.dataset.order.transaction_id
        },
        success: (res) => {
          console.log("cancel", res.data.code)
          if (res.data.code == 'success') {
            Toast({
              context: this,
              selector: '#order-t-toast',
              message: "收货成功",
              theme: 'success',
            });
            wx.navigateBack()
          } else {
            Toast({
              context: this,
              selector: '#order-t-toast',
              message: "收货失败",
              theme: 'fail',
            });
          }
        }
      })
    }
  },
  btn2Tap(e) {
    console.log("btn2tap", e.currentTarget.dataset.order.state)
    let app = getApp()
    let that = this
    if (e.currentTarget.dataset.order.state == 2) {
      wx.request({
        url: app.globalData.URL + '/trans/refund',
        method: "POST",
        timeout: 500,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          token: app.globalData.session_key,
          transId: e.currentTarget.dataset.order.transaction_id
        },
        success: (res) => {
          console.log("cancel", res.data.code)
          if (res.data.code == 'success') {
            Toast({
              context: this,
              selector: '#order-t-toast',
              message: "退款成功",
              theme: 'success',
            });
            wx.navigateBack()
          } else {
            Toast({
              context: this,
              selector: '#order-t-toast',
              message: "退款失败",
              theme: 'fail',
            });
          }
        }
      })
    }
  },

  onOrderCardTap(e) {
    if (e.currentTarget.dataset.order.state == 1) {
      wx.navigateTo({
        url: `/pages/payment/payment?transactionID=${e.currentTarget.dataset.order.transaction_id}`,
      })
    } else if (e.currentTarget.dataset.order.state == 3) {
      wx.navigateTo({
        url: `/pages/comment/comment?transactionID=${e.currentTarget.dataset.order.transaction_id}`,
      })
    }

    // wx.navigateTo({
    //   url: `/pages/order/order-detail/index?orderNo=${order.orderNo}`,
    // });
  },
});