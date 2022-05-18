import {
  config,
  cdnBase
} from '../../config/index';

/** 获取首页数据 */
// function mockFetchHome() {
//   const { delay } = require('../_utils/delay');
//   const { genSwiperImageList } = require('../../model/swiper');
//   return delay().then(() => {
//     return {
//       swiper: genSwiperImageList(),
//       tabList: [
//         {
//           text: '跳蚤市场',
//           key: 0,
//         },
//         {
//           text: '求购求助',
//           key: 1,
//         }
//       ],
//       activityImg: `${cdnBase}/activity/banner.png`,
//     };
//   });
// }

// /** 获取首页数据 */
// export function fetchHome() {
//   if (config.useMock) {
//     return mockFetchHome();
//   }
//   return new Promise((resolve) => {
//     resolve('real api');
//   });
// }