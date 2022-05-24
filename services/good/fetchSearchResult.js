/* eslint-disable no-param-reassign */
// import {
//   config
// } from '../../config/index';

// /** 获取搜索历史 */
// function mockSearchResult(params) {
//   const { delay } = require('../_utils/delay');
//   const { getSearchResult } = require('../../model/search');

//   const data = getSearchResult(params);

//   if (data.spuList.length) {
//     data.spuList.forEach((item) => {
//       item.spuId = item.spuId;
//       item.thumb = item.primaryImage;
//       item.title = item.title;
//       item.price = item.minSalePrice;
//       item.originPrice = item.maxLinePrice;
//       if (item.spuTagList) {
//         item.tags = item.spuTagList.map((tag) => ({ title: tag.title }));
//       } else {
//         item.tags = [];
//       }
//     });
//   }
//   return delay().then(() => {
//     return data;
//   });
// }

/** 获取搜索历史 */
export function getSearchResult(type = 0, pageSize = 20, keywords = "", order = 0, lastId = -1) {
  // if (config.useMock) {
  //   return mockSearchResult(params);
  // }
  return new Promise((resolve, reject) => {
    console.log(getApp().globalData.session_key);
    // 根据类型决定目标url
    var url = getApp().globalData.URL + "list/search";
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
        search: search, // 检索信息
        order: order, // 顺序, 0: 随机；1：升序；2：降序；3：时间倒序
        lastId: lastId
      },
      success: (res) => {
        if (res.statusCode === 200) {
          console.log(res)
          resolve(res);
        } else {
          reject({
            code: 'fail'
          });
        }
      },
      fail: (res) => {
        reject({
          code: 'fail'
        });
      }
    });
  });
}