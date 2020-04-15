// pages/hotel/dishes/detail.js
const app = getApp()
const mta = require('../../../utils/mta_analysis.js')
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var goods_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    let tab = options.tab;
    try { that.setNavigationBarTitle(tab); } catch (error) { console.error(error); }
    goods_id = options.goods_id
    utils.PostRequest(api_v_url + '/dish/detail', {
      goods_id: goods_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        goods_info: data.result
      })
    }, function () {
      wx.navigateBack({
        delta: 1
      })
    })
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

  setNavigationBarTitle: function (tab) {
    let navigationBarTitle = '';
    switch (tab) {
      case 'take-out':
        navigationBarTitle = '菜品详情';
        break;
      case 'nationwide':
        navigationBarTitle = '商品详情';
        break;
      default:
        navigationBarTitle = '详情页';
        break;
    }
    wx.setNavigationBarTitle({ title: navigationBarTitle });
  }
})