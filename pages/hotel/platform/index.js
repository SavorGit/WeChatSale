// pages/hotel/platform/index.js
const app = getApp()
const mta = require('../../../utils/mta_analysis.js')
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;

var merchant_id;
var openid;
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
    var that = this;
    merchant_id = options.merchant_id;
    openid = options.openid;
    //获取酒楼第三方平台二维码
    utils.PostRequest(api_v_url + '/dish/getPlatform', {
      openid: openid,
      merchant_id: merchant_id,
      
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        platform_list: data.result
      })
    })
  },
  gotoAddPlatform:function(e){
    wx.navigateTo({
      url: '/pages/hotel/platform/add?merchant_id='+merchant_id+'&openid='+openid,
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
    var that = this;
    //获取酒楼第三方平台二维码
    utils.PostRequest(api_v_url + '/dish/getPlatform', {
      openid: openid,
      merchant_id: merchant_id,

    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        platform_list: data.result
      })
    })
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