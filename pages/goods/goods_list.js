// pages/goods/goods_list.js
const app = getApp()
const utils = require('../../utils/util.js')
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var hotel_id;
var openid;
var page = 1;
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
    var that = this;
    hotel_id = options.hotel_id;
    openid   = options.openid;
    
    utils.PostRequest(api_v_url + '/goods/goodslist', {
      openid: openid,
      hotel_id: hotel_id,
      page : 1
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        goods_list: data.result
      })
    })
  },
  /**
   * 商品展示 
   */
  loadMore: function (res) {
    var that = this;
    page +=1;

    utils.PostRequest(api_v_url + '/goods/goodslist', {
      openid: openid,
      hotel_id: hotel_id,
      page :page
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        goods_list: data.result.datalist
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