// pages/hotel/setting/agent_setting.js
/**
 * 代购设置页面
 */


Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  // 打开提示弹窗
  openChangeSalePriceTipPopWindow: function (e) {
    let self = this;
    self.setData({ showTipsPopWindow: true, tipsPopWindowTitle: '提示', tipsPopWindowContents: ['1.您在允许代购改价售卖时，代购可以在菜品原价的基础上进行调整。以此来进行售卖获得代购自己的收益。', '2.如果您不支持菜品改价售卖，可能会使代购售卖您餐厅的菜品时产生障碍，需要单独与您在线下沟通代购在帮您餐厅售卖菜品时如何获得利润。'] });
  },
})