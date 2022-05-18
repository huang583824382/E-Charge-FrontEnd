// import { config } from '../../config/index';

// /** 获取商品列表 */
// function mockFetchGoodsList(pageIndex = 1, pageSize = 20) {
//   const { delay } = require('../_utils/delay');
//   const { getGoodsList } = require('../../model/goods');
//   return delay().then(() =>
//     getGoodsList(pageIndex, pageSize).map((item) => {
//       return {
//         spuId: item.spuId,
//         thumb: item.primaryImage,
//         title: item.title,
//         price: item.minSalePrice,
//         //tags: item.spuTagList.map((tag) => tag.title),
//       };
//     }),
//   );
// }

/** 获取商品或任务列表 */
export function fetchGoodsList(type = 0, pageSize = 20, search = "") {
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
        search: search, // 检索信息
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
}