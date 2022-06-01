import {
  fetchGood
} from '../../../services/good/fetchGood';
import {
  fetchActivityList
} from '../../../services/activity/fetchActivityList';
import {
  getGoodsDetailsCommentList,
  getGoodsDetailsCommentsCount,
} from '../../../services/good/fetchGoodsDetailsComments';

import {
  cdnBase
} from '../../../config/index';


// 用于确认购买
import Dialog from 'tdesign-miniprogram/dialog/index';
import Toast from 'tdesign-miniprogram/toast/index';


const imgPrefix = `${cdnBase}/`;

const recLeftImg = `${imgPrefix}common/rec-left.png`;
const recRightImg = `${imgPrefix}common/rec-right.png`;
const obj2Params = (obj = {}, encode = false) => {
  const result = [];
  Object.keys(obj).forEach((key) =>
    result.push(`${key}=${encode ? encodeURIComponent(obj[key]) : obj[key]}`),
  );

  return result.join('&');
};

Page({
  data: {
    // commentsList: [],
    // commentsStatistics: {
    //   badCount: 0,
    //   commentCount: 0,
    //   goodCount: 0,
    //   goodRate: 0,
    //   hasImageCount: 0,
    //   middleCount: 0,
    // },
    isShowPromotionPop: false,
    // activityList: [],
    recLeftImg,
    recRightImg,
    details: {},
    goodsTabArray: [{
        name: '商品',
        value: '', // 空字符串代表置顶
      },
      {
        name: '详情',
        value: 'goods-page',
      },
    ],
    // storeLogo: `${imgPrefix}common/store-logo.png`,
    // storeName: '云mall标准版旗舰店',
    jumpArray: [{
        title: '首页',
        url: '/pages/home/home',
        iconName: 'home',
      },
      {
        title: '举报',
        url: '/pages/report/report',
        iconName: 'error',
        showCartNum: false,
      },
    ],
    isStock: true,
    //cartNum: 0,
    soldout: false,
    buttonType: 1,
    // buyNum: 1,
    // selectedAttrStr: '',
    // skuArray: [],
    // primaryImage: '',
    // specImg: '',
    isSpuSelectPopupShow: false,
    isAllSelectedSku: false,
    buyType: 0,
    //outOperateStatus: false, // 是否外层加入购物车
    operateType: 0,
    selectSkuSellsPrice: 0,
    // maxLinePrice: 0,
    // minSalePrice: 0,
    // maxSalePrice: 0,
    list: [],
    spuId: 0,
    navigation: {
      type: 'fraction'
    },
    current: 0,
    autoplay: true,
    duration: 500,
    interval: 5000,
    //soldNum: 0, // 已售数量
    itemInfo: null,
  },

  handlePopupHide() {
    this.setData({
      isSpuSelectPopupShow: false,
    });
  },

  showSkuSelectPopup(type) {
    this.setData({
      buyType: type || 0,
      outOperateStatus: type >= 1,
      isSpuSelectPopupShow: true,
    });
  },

  buyItNow(e) {
    // buy
    if (this.data.buttonType === 1 || this.data.buttonType === 2) {
      this.showSkuSelectPopup(1);
    }
    // delete
    else if (this.data.buttonType === 3) {
      Dialog.confirm({
        title: '确认删除',
        content: '您确认要删除该发布项吗',
        confirmBtn: '确认',
        cancelBtn: '取消',
      }).then(() => {
        console.log(e);
        var url = getApp().globalData.URL + "/commodity/delete";
        console.log(url);
        wx.request({
          url: url,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: {
            token: getApp().globalData.session_key, // token
            itemId: this.data.itemInfo.itemId // item id
          },
          success: (res) => {
            if (res.statusCode === 200) {
              console.log(res);
              if (res.data.code === "fail") {
                this.showInfo(false, '出错了，请稍后重试');
              } else if (res.data.code === "no right") {
                this.showInfo(false, '您没有删除该发布项的权限');
              } else {
                this.showInfo(true, '成功删除该发布项');
                // 回到主页
                wx.switchTab({
                  url: '/pages/home/home',
                });
              }
            } else {
              this.showInfo(false, '出错了，请稍后重试');
            }
          },
          fail: (res) => {
            console.log(res);
            this.showInfo(false, '出错了，请稍后重试');
          }
        });
      })
    }
  },

  // 前往会话界面
  toAddCart() {
    if (this.data.buttonType === 1 || this.data.buttonType === 2) {
      const conversationId = 'C2C' + this.data.itemInfo.pubId.toString();
      console.log(conversationId);
      // wx.navigateTo({
      //   url: `/pages/chat/chat?conversationID=${conversationId}`,
      // })
      wx.navigateTo({
        url: `/pages/personHome/personHome?uid=${this.data.itemInfo.pubId}`,
      })
    } else if (this.data.buttonType === 3) {
      wx.switchTab({
        url: '/pages/home/home',
      })
    }
    //this.showSkuSelectPopup(2);
  },

  toNav(e) {
    console.log(e);
    const {
      url
    } = e.detail;
    if (url === "/pages/home/home") {
      wx.switchTab({
        url: url,
      });
    } else {
      const id = this.data.spuId;
      wx.navigateTo({
        url: `/pages/report/report?isUser=false&id=${id}`,
      })
    }
  },

  showCurImg(e) {
    const {
      index
    } = e.detail;
    const {
      images
    } = this.data.details;
    wx.previewImage({
      current: images[index],
      urls: images, // 需要预览的图片http链接列表
    });
  },

  onPageScroll({
    scrollTop
  }) {
    const goodsTab = this.selectComponent('#goodsTab');
    goodsTab && goodsTab.onScroll(scrollTop);
  },

  chooseSpecItem(e) {
    const {
      specList
    } = this.data.details;
    const {
      selectedSku,
      isAllSelectedSku
    } = e.detail;
    if (!isAllSelectedSku) {
      this.setData({
        selectSkuSellsPrice: 0,
      });
    }
    this.setData({
      isAllSelectedSku,
    });
    this.getSkuItem(specList, selectedSku);
  },

  getSkuItem(specList, selectedSku) {
    const {
      skuArray,
      primaryImage
    } = this.data;
    const selectedSkuValues = this.getSelectedSkuValues(specList, selectedSku);
    let selectedAttrStr = ` 件  `;
    selectedSkuValues.forEach((item) => {
      selectedAttrStr += `，${item.specValue}  `;
    });
    // eslint-disable-next-line array-callback-return
    const skuItem = skuArray.filter((item) => {
      let status = true;
      (item.specInfo || []).forEach((subItem) => {
        if (
          !selectedSku[subItem.specId] ||
          selectedSku[subItem.specId] !== subItem.specValueId
        ) {
          status = false;
        }
      });
      if (status) return item;
    });
    this.selectSpecsName(selectedSkuValues.length > 0 ? selectedAttrStr : '');
    if (skuItem) {
      this.setData({
        selectItem: skuItem,
        selectSkuSellsPrice: skuItem.price || 0,
      });
    } else {
      this.setData({
        selectItem: null,
        selectSkuSellsPrice: 0,
      });
    }
    this.setData({
      specImg: skuItem && skuItem.skuImage ? skuItem.skuImage : primaryImage,
    });
  },

  // 获取已选择的sku名称
  getSelectedSkuValues(skuTree, selectedSku) {
    const normalizedTree = this.normalizeSkuTree(skuTree);
    return Object.keys(selectedSku).reduce((selectedValues, skuKeyStr) => {
      const skuValues = normalizedTree[skuKeyStr];
      const skuValueId = selectedSku[skuKeyStr];
      if (skuValueId !== '') {
        const skuValue = skuValues.filter((value) => {
          return value.specValueId === skuValueId;
        })[0];
        skuValue && selectedValues.push(skuValue);
      }
      return selectedValues;
    }, []);
  },

  normalizeSkuTree(skuTree) {
    const normalizedTree = {};
    skuTree.forEach((treeItem) => {
      normalizedTree[treeItem.specId] = treeItem.specValueList;
    });
    return normalizedTree;
  },

  selectSpecsName(selectSpecsName) {
    if (selectSpecsName) {
      this.setData({
        selectedAttrStr: selectSpecsName,
      });
    } else {
      this.setData({
        selectedAttrStr: '',
      });
    }
  },


  addCart() {

  },

  // 提示信息
  showInfo(suc, msg) {
    Toast({
      context: this,
      selector: '#t-toast',
      message: msg,
      theme: suc ? 'success' : 'fail',
      timeout: 500,
    });
  },

  // 确认是否购买，是则前往
  gotoBuy(type) {
    //const { isAllSelectedSku, buyNum } = this.data;
    // if (!isAllSelectedSku) {
    //   Toast({
    //     context: this,
    //     selector: '#t-toast',
    //     message: '请选择规格',
    //     icon: '',
    //     duration: 1000,
    //   });
    //   return;
    // }
    if (this.data.buttonType === 1 || this.data.buttonType === 2) {
      // 询问是否需要
      Dialog.confirm({
        title: this.data.itemInfo.type === 0 ? '确认购买' : '确认领取',
        content: this.data.itemInfo.type === 0 ? '您确认要购买该商品吗?' : '您确认要领取该任务吗',
        confirmBtn: '确认',
        cancelBtn: '取消',
      }).then(() => {
        // 确认，发送请求，生成订单
        var url = getApp().globalData.URL + "/trans/buy";
        console.log(url);
        wx.request({
          url: url,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: {
            token: getApp().globalData.session_key, // token
            itemId: this.data.spuId // item id
          },
          success: (res) => {
            if (res.statusCode === 200) {
              console.log(res);
              if (res.data.code === "fail") {
                this.showInfo(false, '出错了，请稍后重试');
              } else if (res.data.code === "has been bought") {
                this.showInfo(false, '出手慢了，该商品已被购买');
              } else {
                var info = this.data.itemInfo.type === 0 ? '成功下单，即将前往支付界面' : '成功领取任务，即将前往首页';
                this.showInfo(true, info);
                // 隐藏弹窗
                this.handlePopupHide();
                if (this.data.itemInfo.type === 1) {
                  // 回到主页
                  wx.switchTab({
                    url: '/pages/home/home',
                  });
                } else {
                  wx.navigateTo({
                    url: `/pages/payment/payment?transactionID=${res.data.transId}`,
                  })
                }
                // wx.navigateTo({
                //   url: '/pages/home/home',
                // });
              }
            } else {
              this.showInfo(false, '出错了，请稍后重试');
            }
          },
          fail: (res) => {
            console.log(res);
            this.showInfo(false, '出错了，请稍后重试');
          }
        });


      });
    }

    // const query = {
    //   quantity: buyNum,
    //   storeId: '1',
    //   spuId: this.data.spuId,
    //   goodsName: this.data.details.title,
    //   skuId:
    //     type === 1 ? this.data.skuList[0].skuId : this.data.selectItem.skuId,
    // };
    // let urlQueryStr = obj2Params({
    //   goodsRequestList: JSON.stringify([query]),
    // });
    // urlQueryStr = urlQueryStr ? `?${urlQueryStr}` : '';
    // const path = `/pages/order/order-confirm/index${urlQueryStr}`;
  },

  // TODO: 根据身份进行拓展
  specsConfirm() {
    const {
      buyType
    } = this.data;
    // 购买
    if (buyType === 1) {
      this.gotoBuy();
    } else {
      //this.addCart();
    }
    this.handlePopupHide();
  },

  changeNum(e) {
    this.setData({
      buyNum: e.detail.buyNum,
    });
  },

  closePromotionPopup() {
    this.setData({
      isShowPromotionPop: false,
    });
  },

  promotionChange(e) {
    const {
      index
    } = e.detail;
    wx.navigateTo({
      url: `/pages/promotion-detail/index?promotion_id=${index}`,
    });
  },

  showPromotionPopup() {
    this.setData({
      isShowPromotionPop: true,
    });
  },

  // getDetail(spuId) {
  //   Promise.all([fetchGood(spuId), fetchActivityList()]).then((res) => {
  //     const [details, activityList] = res;
  //     const skuArray = [];
  //     const {
  //       skuList,
  //       primaryImage,
  //       isPutOnSale,
  //       minSalePrice,
  //       maxSalePrice,
  //       maxLinePrice,
  //       soldNum,
  //     } = details;
  //     skuList.forEach((item) => {
  //       skuArray.push({
  //         skuId: item.skuId,
  //         quantity: item.stockInfo ? item.stockInfo.stockQuantity : 0,
  //         specInfo: item.specInfo,
  //       });
  //     });
  //     const promotionArray = [];
  //     activityList.forEach((item) => {
  //       promotionArray.push({
  //         tag: item.promotionSubCode === 'MYJ' ? '满减' : '满折',
  //         label: '满100元减99.9元',
  //       });
  //     });
  //     this.setData({
  //       details,
  //       activityList,
  //       isStock: details.spuStockQuantity > 0,
  //       maxSalePrice: maxSalePrice ? parseInt(maxSalePrice) : 0,
  //       maxLinePrice: maxLinePrice ? parseInt(maxLinePrice) : 0,
  //       minSalePrice: minSalePrice ? parseInt(minSalePrice) : 0,
  //       list: promotionArray,
  //       skuArray: skuArray,
  //       primaryImage,
  //       soldout: isPutOnSale === 0,
  //       soldNum,
  //     });
  //   });
  // },

  // async getCommentsList() {
  //   try {
  //     const code = 'Success';
  //     const data = await getGoodsDetailsCommentList();
  //     const {
  //       homePageComments
  //     } = data;
  //     if (code.toUpperCase() === 'SUCCESS') {
  //       const nextState = {
  //         commentsList: homePageComments.map((item) => {
  //           return {
  //             goodsSpu: item.spuId,
  //             userName: item.userName || '',
  //             commentScore: item.commentScore,
  //             commentContent: item.commentContent || '用户未填写评价',
  //             userHeadUrl: item.isAnonymity ?
  //               this.anonymityAvatar : item.userHeadUrl || this.anonymityAvatar,
  //           };
  //         }),
  //       };
  //       this.setData(nextState);
  //     }
  //   } catch (error) {
  //     console.error('comments error:', error);
  //   }
  // },

  onShareAppMessage() {
    // 自定义的返回信息
    const {
      selectedAttrStr
    } = this.data;
    let shareSubTitle = '';
    if (selectedAttrStr.indexOf('件') > -1) {
      const count = selectedAttrStr.indexOf('件');
      shareSubTitle = selectedAttrStr.slice(count + 1, selectedAttrStr.length);
    }
    const customInfo = {
      imageUrl: this.data.details.primaryImage,
      title: this.data.details.title + shareSubTitle,
      path: `/pages/goods/details/index?spuId=${this.data.spuId}`,
    };
    return customInfo;
  },

  /** 获取评价统计 */
  // async getCommentsStatistics() {
  //   try {
  //     const code = 'Success';
  //     const data = await getGoodsDetailsCommentsCount();
  //     if (code.toUpperCase() === 'SUCCESS') {
  //       const {
  //         badCount,
  //         commentCount,
  //         goodCount,
  //         goodRate,
  //         hasImageCount,
  //         middleCount,
  //       } = data;
  //       const nextState = {
  //         commentsStatistics: {
  //           badCount: parseInt(`${badCount}`),
  //           commentCount: parseInt(`${commentCount}`),
  //           goodCount: parseInt(`${goodCount}`),
  //           /** 后端返回百分比后数据但没有限制位数 */
  //           goodRate: Math.floor(goodRate * 10) / 10,
  //           hasImageCount: parseInt(`${hasImageCount}`),
  //           middleCount: parseInt(`${middleCount}`),
  //         },
  //       };
  //       this.setData(nextState);
  //     }
  //   } catch (error) {
  //     console.error('comments statiistics error:', error);
  //   }
  // },

  // /** 跳转到评价列表 */
  // navToCommentsListPage() {
  //   wx.navigateTo({
  //     url: `/pages/goods/comments/index?spuId=${this.data.spuId}`,
  //   });
  // },

  onLoad(query) {
    const app = getApp();
    const {
      spuId
    } = query;

    console.log(spuId);

    this.setData({
      spuId: spuId,
    });
    console.log(this.data.spuId);
    // this.getDetail(spuId);
    // this.getCommentsList(spuId);
    // this.getCommentsStatistics(spuId);
    // 发请求，根据itemId获取商品/任务信息
    wx.request({
      url: app.globalData.URL + '/commodity/info',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        token: app.globalData.session_key,
        itemId: spuId // itemId
      },
      success: (res) => {
        console.log(res);
        if (res.statusCode == 200) {
          if (res.data.code === "success") {
            var item = res.data.commodity;
            var images = [];
            if (item.figureUrls === '') {
              images.push(app.globalData.IMG_SERVER + '/NoPic.jpg');
            } else {
              images = item.figureUrls.split(";");
            }
            item.images = images;
            item.tags = (item.tags == '' ? [] : item.tags.split(';'));
            this.setData({
              itemInfo: item,
              soldout: item.state === 3,
              isStock: item !== 3,
              buttonType: (getApp().globalData.uid === item.pubId) ? 3 : (item.type + 1),
            });
          }
        } else {

        }
      },
      fail: (res) => {
        console.log(res);

      }
    })
  },
});