// pages/purchase/shopping/goods_detail.js
/**
 * 商品详情页面
 */
const app = getApp()
const utils = require('../../../utils/util.js')
const mta = require('../../../utils/mta_analysis.js')
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var goods_id;
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
    wx.hideShareMenu();
    var that = this;
    openid = options.openid;
    goods_id = options.goods_id;
    var is_share = 0;
    if (typeof (options.is_share) != 'undefined') {
      var is_share = options.is_share
    }
    that.setData({
      openid: openid,
      goods_id: goods_id,
      is_share: is_share
    })
    //菜品详情
    that.getDishInfo(goods_id)
  },
  getDishInfo: function (goods_id) {
    var that = this;
    utils.PostRequest(api_v_url + '/dish/detail', {
      goods_id: goods_id,
      openid: openid,
    }, (data, headers, cookies, errMsg, statusCode) => that.setData({
      goods_info: data.result,
      merchant: data.result.merchant
    }), function () {
      var is_share = that.data.is_share
      if (is_share == true) {
        wx.reLaunch({
          url: '/pages/demand/index',
        })

      } else {
        wx.navigateBack({
          delta: 1
        })
      }
    });
  },
  creatPost:function(e){
    wx.navigateTo({
      url: '/pages/purchase/shopping/poster?goods_id='+goods_id+'&openid='+openid,
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