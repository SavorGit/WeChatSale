// pages/hotel/setting/distribution.js
/**
 * 配送设置页面
 */
const app = getApp()
const mta = require('../../../utils/mta_analysis.js')
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var oss_upload_url = app.globalData.oss_upload_url;
var oss_url = app.globalData.oss_url;
var cache_key = app.globalData.cache_key;
var merchant_id;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delivery_platform:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    openid = options.openid;
    merchant_id = options.merchant_id;
    utils.PostRequest(api_v_url + '/merchant/info', {
      merchant_id: merchant_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var merchant_info = data.result;
      that.setData({
        delivery_platform: data.result.delivery_platform
      })
    })
  },
  platformChange:function(e){
    var that = this;
    var delivery_platform = e.detail.value;
    that.setData({
      delivery_platform: delivery_platform
    })
  },
  setPlatform:function(e){
    var that = this;
    var delivery_platform = that.data.delivery_platform;
    utils.PostRequest(api_v_url + '/merchant/setDeliveryPlatform', {
      openid: openid,
      delivery_platform: delivery_platform,
    }, (data, headers, cookies, errMsg, statusCode) => {
      app.showToast('保存成功');
      wx.navigateBack({
        delta:1
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

  }
})