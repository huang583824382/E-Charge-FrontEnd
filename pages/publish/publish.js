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
    label: [{
        label: 'food',
        value: '食品'
      },
      {
        label: '工具',
        value: '工具'
      },
      {
        label: '药品',
        value: '药品'
      },
      {
        label: '代购',
        value: '代购'
      },
      {
        label: '帮忙',
        value: '帮忙'
      },
    ],
    goods_data: {
      title: "",
      detail: ""
    },
    tasks_data: {
      title: "",
      detail: ""
    },
    originFiles_goods: [],
    originFiles_tasks: [],
    gridConfig: {
      column: 4,
      width: 160,
      height: 160,
    },
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

  onGoodsTitle() {

  },
  formSubmit() {
    const {
      submitActive_goods
    } = this.data;
    if (!submitActive_goods) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: "未输入全部信息",
        icon: '',
        duration: 1000,
      });
      return;
    }
  },

  getRandFileName(filePath) {
    const extIndex = filePath.lastIndexOf('.');
    const extName = extIndex === -1 ? '' : filePath.substr(extIndex);
    return parseInt(`${Date.now()}${Math.floor(Math.random() * 900 + 100)}`, 10).toString(36) + extName;
  },
  handleSuccess_goods(e) {
    const {
      files
    } = e.detail;

    this.setData({
      originFiles_goods: files,
    });
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


  onPicker1Confirm(e) {
    console.log('picker1 confirm:', e.detail);
    this.setData({
      selectedCityValue: e.detail.value?.value,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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