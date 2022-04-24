// store/pages/goodsbreakage/nocode/index.js
/**
 * 报损 无码报损 首页
 */
const app = getApp()
const utils = require('../../../../utils/util.js')
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { name: "我入库的商品", button: { enable: false, label: "报损" },type:1 },
      { name: "我出库的商品", button: { enable: true, label: "报损" } ,type:2},
      { name: "我领取的商品", button: { enable: true, label: "报损" } ,type:3}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    openid = app.globalData.openid;

  },
  gotoPage:function(e){
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/store/pages/goodsbreakage/nocode/goodslist?type='+type,
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