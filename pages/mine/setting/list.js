// pages/mine/setting/list.js
/**
 * 设置列表页面
 */

const app = getApp()
var mta = require('../../../utils/mta_analysis.js')
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var merchant_id ; 
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
    wx.hideShareMenu();
    openid = options.openid;
    merchant_id = options.merchant_id;

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
    utils.PostRequest(api_v_url + '/merchant/info', {
      merchant_id:merchant_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        merchant_info:data.result,
        delivery_platform: data.result.delivery_platform,
        is_shopself: data.result.is_shopself,
      })
    })
  },
  setShopself:function(e){
    var that = this;
    console.log(e);
    var status = e.detail.value;
    if(status==false){
      var is_shopself = 0;
    }else if(status==true){
      var is_shopself = 1;
    }
    utils.PostRequest(api_v_url + '/merchant/setShopself', {
      openid: openid,
      is_shopself: is_shopself
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        is_shopself: is_shopself
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

  },

  // 跳转页面
  gotoSetting: function (e) {
    wx.showLoading({
      title: '正在跳转...',
      mask: true
    });
    let jumpType = e.currentTarget.dataset.type;
    switch (jumpType) {
      case 'basic':
        wx.navigateTo({
          url: '/pages/hotel/setting/basic?merchant_id=' + merchant_id + '&openid=' + openid,
          success: function (res) {
            wx.hideLoading();
          },
          fail: function (res) {
            wx.showToast({
              icon: 'none',
              title: '跳转失败！',
            });
          }
        });
        break;
      case 'distribution':
        wx.navigateTo({
          url: '/pages/hotel/setting/distribution?merchant_id=' + merchant_id + '&openid=' + openid,
          success: function (res) {
            wx.hideLoading();
          },
          fail: function (res) {
            wx.showToast({
              icon: 'none',
              title: '跳转失败！',
            });
          }
        });
        break;
      case 'customer-pay':
        wx.navigateTo({
          url: '/pages/hotel/setting/customer_pay?merchant_id=' + merchant_id + '&openid=' + openid,
          success: function (res) {
            wx.hideLoading();
          },
          fail: function (res) {
            wx.showToast({
              icon: 'none',
              title: '跳转失败！',
            });
          }
        });
        break;
      case 'third-platform':
        wx.navigateTo({
          url: '/pages/hotel/platform/index?merchant_id=' + merchant_id + '&openid=' + openid,
          success: function (res) {
            wx.hideLoading();
          },
          fail: function (res) {
            wx.showToast({
              icon: 'none',
              title: '跳转失败！',
            });
          }
        });
        break;
      case 'agent-setting':
        wx.navigateTo({
          url: '/pages/hotel/setting/agent_setting?merchant_id=' + merchant_id + '&openid=' + openid,
          success: function (res) {
            wx.hideLoading();
          },
          fail: function (res) {
            wx.showToast({
              icon: 'none',
              title: '跳转失败！',
            });
          }
        });
        break;
      default:
        wx.showToast({
          icon: 'none',
          title: '无此类型',
        });
        break;
    }
  }
})