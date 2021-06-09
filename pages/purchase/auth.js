// pages/purchase/auth.js
/**
 * 审核页面
 */
const app = getApp()
const utils = require('../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;

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
    wx.hideHomeButton();
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
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    var openid = user_info.openid;
    utils.PostRequest(api_v_url + '/User/isRegister', {
      openid: openid
    }, (data, headers, cookies, errMsg, statusCode) => {
      var userinfo = data.result.userinfo;
      if (userinfo.role_type == 4 && userinfo.status == 1) {
        wx.reLaunch({
          url: '/pages/purchase/index',
        })
      }

    });
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


  /**
   * 拨打订餐电话
   */
  phonecallevent: function (e) {
    wx.makePhoneCall({
      phoneNumber: '13811966726'
    });
  }
})