// store/pages/storereceive/index.js
/**
 * 领取商品 首页
 */
const app = getApp()
const utils = require('../../../utils/util.js')
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
      { stock_id: 122, name: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", add_time: "2022/04/10 11:00", user_name: "陈灵玉", status: 0 },
      { stock_id: 121, name: "恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩恩", add_time: "2022/04/10 10:00", operauser_nametor: "陈灵玉", status: 0 },
      { stock_id: 120, name: "哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦", add_time: "2022/04/10 09:00", user_name: "陈灵玉", status: 0 }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    openid = app.globalData.openid;
    //获取出货单
    this.getStockList();
  },
  getStockList:function(){
    var that = this;
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid: openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      
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