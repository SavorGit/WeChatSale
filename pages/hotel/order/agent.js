// pages/hotel/order/agent.js
/**
 * 分销订单页面
 */
const app = getApp()
const mta = require('../../../utils/mta_analysis.js')
const utils = require('../../../utils/util.js')
var api_v_url = app.globalData.api_v_url;
var page = 1;
var openid;
var merchant_id;
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
    openid = options.openid;
    merchant_id = options.merchant_id;

    utils.PostRequest(api_v_url + '/aa/bb', {
      openid: openid,
      merchant_id: merchant_id,
      page: 1,
    }, (data, headers, cookies, errMsg, statusCode) => {
      
    })
  },
  loadMore:function(e){
    page +=1;
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid: openid,
      merchant_id: merchant_id,
      page: 1,
    }, (data, headers, cookies, errMsg, statusCode) => {

    })
  },
  /**
   * 拨打订餐电话
   */
  phonecallevent: function (e) {
    var tel = e.target.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
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