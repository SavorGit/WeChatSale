// pages/hotel/order/goods_logistics_info.js
/**
 * 物流详情页面
 */
const app = getApp()
const mta = require('../../../utils/mta_analysis.js')
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var order_id;
var express_id;
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
    wx.hideShareMenu();
    var that = this;
    if (typeof (options) != 'object') {
      that.showToastAndNavigateBack('未知订单');
      return;
    }
    openid = options.openid;
    order_id = options.order_id;
    if (typeof (order_id) != 'string' || order_id.trim() == '') {
      that.showToastAndNavigateBack('未知订单号');
      return;
    }
    if(typeof(options.exress_id)!='undefined'){
      express_id = options.express_id
    }
    utils.PostRequest(api_v_url + '/express/getExpress', {
      openid: openid,
      order_id: order_id,
      express_id:express_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      console.log('express', data, data.result.data);
      if (typeof (data.result.data) != 'object') {
        that.showToastAndNavigateBack('此订单无物流信息');
        return;
      }
      that.setData({
        express_info: data.result,
        expres_list: data.result.data,
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

  showToastAndNavigateBack: function (title) {
    let duration = 2000;
    wx.showToast({
      title: title,
      duration: duration,
      icon: "none",
      mask: true
    });
    setTimeout(function () {
      wx.navigateBack();
    }, duration);
  }
})