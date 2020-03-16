// pages/hotel/setting/basic.js
/**
 * 基本信息设置页面
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTipPopWindow: false,
    tipContent: ''
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
  openTipPopWindow: function (e) {
    let self = this;
    self.setData({ showTipPopWindow: true, tipTitle: '说明', tipContent: '提示内容' });
  },

  // 打开提示弹窗
  closeTipPopWindow: function (e) {
    let self = this;
    self.setData({ showTipPopWindow: false });
  }
})