// store/pages/storereceive/billinfo.js
/**
 * 领取商品 出库信息
 */
const app = getApp()
const utils = require('../../../utils/util.js')
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var stock_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    billList: [],
    title:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    openid   = app.globalData.openid;
    stock_id = options.stock_id;
    this.getStockInfo(); 
  },
  getStockInfo:function(){
    var that = this;
    utils.PostRequest(api_v_url + '/stock/getGoodsByStockid', {
      openid  : openid,
      stock_id: stock_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      var goodsList = data.result.goods_list
      for(let i in goodsList){
        goodsList[i].viewBt = true;
      }
      that.setData({goodsList:goodsList})
      var stock_info = {};
      stock_info.stock_id = data.result.stock_id;
      stock_info.name     = data.result.name;
      stock_info.add_time = data.result.add_time;
      stock_info.user_name = data.result.user_name;
      stock_info.status = 2
      var billList = that.data.billList;
      billList.push(stock_info);
      var title = data.result.name;

      that.setData({billList:billList,title:title})
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