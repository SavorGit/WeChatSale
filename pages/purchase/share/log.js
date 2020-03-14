// pages/purchase/share/log.js
/**
 * 选品记录列表页面
 */

const app = getApp()
const utils = require('../../../utils/util.js')
const mta = require('../../../utils/mta_analysis.js')
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var page = 1;
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
    var that = this;
    openid = options.openid;
    utils.PostRequest(api_v_url + '/purchase/selectionList', {
      openid: openid,
      page:1
    }, (data, headers, cookies, errMsg, statusCode) => that.setData({
      share_list: data.result.datalist
    }));
  },
  loadMore:function(e){
    var that = this;
    page +=1;
    utils.PostRequest(api_v_url + '/purchase/selectionList', {
      openid: openid,
      page: page
    }, (data, headers, cookies, errMsg, statusCode) => that.setData({
      share_list: data.result.datalist
    }));
  },
  gotoDishes:function(e){
    var goods_id = e.currentTarget.dataset.goods_id;
    wx.navigateTo({
      url: '/pages/purchase/dishes/detail?goods_id=' + goods_id + '&openid=' + openid +'&is_share=1',
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