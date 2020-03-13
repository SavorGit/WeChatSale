// pages/purchase/index.js
/**
 * 分销 - 主页
 */
const app = getApp()
const utils = require('../../utils/util.js')
const mta = require('../../utils/mta_analysis.js')
var cache_key = app.globalData.cache_key;
var openid;
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
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
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
    wx.hideHomeButton();
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


  // 页面跳转
  gotoPage: function (e) {
    let self = this;
    let pageType = e.currentTarget.dataset.page;
    wx.showLoading({
      title: '正在跳转...',
      mask: true
    });
    switch (pageType) {
      case 'foods':
        wx.navigateTo({
          url: '/pages/purchase/merchant/index?openid='+openid,
          success: function (res) {
            wx.hideLoading();
          }
        });
        break;
      case 'share':
        wx.navigateTo({
          url: '/pages/purchase/share/index?openid='+openid,
          success: function (res) {
            wx.hideLoading();
          }
        });
        break;
      case 'order':
        wx.navigateTo({
          url: '/pages/purchase/order/index?openid=' + openid +"&order_status=0",
          success: function (res) {
            wx.hideLoading();
          }
        });
        break;
      case 'recod':
        wx.navigateTo({
          url: '/pages/purchase/share/log?openid='+openid,
          success: function (res) {
            wx.hideLoading();
          }
        });
        break;
      default:
        wx.showToast({
          icon: 'none',
          title: '无此页面',
        });
        break;
    }
  }
})