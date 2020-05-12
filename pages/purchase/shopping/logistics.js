// pages/purchase/shopping/logistics.js
/**
 * [分销端] 物流信息页面
 */


Page({

  /**
   * 页面的初始数据
   */
  data: {
    contact: '张三三',
    phone: '13800138000',
    address: '北京市朝阳X XX XXX XXXX XX XX XXX XXX XX',
    logisticsTab: 1,
    logisticsList: [{
      status: '运输中',
      context: '离开XXXX，下一站XXXXXXXXX',
      time: '2020-3-27 9:00:00'
    }, {
      status: '揽收',
      context: '未录入',
      time: '2020-3-26 9:00:00'
    }, {
      status: '签收',
      context: '完成',
      time: '2020-3-28 9:00:00'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 选项卡选择
  showLogisticsTab: function (e) {
    let self = this;
    let tabType = e.currentTarget.dataset.tab;
    self.setData({
      logisticsTab: tabType
    });
  },
})