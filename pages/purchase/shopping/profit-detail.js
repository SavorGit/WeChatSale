// pages/purchase/shopping/profit-detail.js
/**
 * 收益明细页面
 */
const utils = require('../../../utils/util.js')
var mta = require('../../../utils/mta_analysis.js')
const app = getApp()
var api_v_url = app.globalData.api_v_url;
var openid; //用户openid
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
    wx.hideShareMenu();
    var that = this;
    openid = options.openid;
    that.getIncomeList(1)
  },
  getIncomeList:function(page){
    var that = this;
    utils.PostRequest(api_v_url + '/purchase/incomerecord', {
      openid: openid,
      page: page
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        income_list: data.result.datalist,
      })
    });
  },
  loadMore:function(e){
    var that = this;
    page +=1;
    that.getIncomeList(page);
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