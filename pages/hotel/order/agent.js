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
    var that = this;
    openid = options.openid;
    merchant_id = options.merchant_id;

    utils.PostRequest(api_v_url + '/purchase/userList', {
      openid: openid,
      merchant_id: merchant_id,
      page: 1,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        userList: data.result.datalist
      })
    })
  },
  loadMore:function(e){
    var that = this;
    page +=1;
    utils.PostRequest(api_v_url + '/purchase/userList', {
      openid: openid,
      merchant_id: merchant_id,
      page: page,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        userList: data.result.datalist
      })
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
  gotoOrder:function(e){
    var status = e.currentTarget.dataset.status;
    var type = e.currentTarget.dataset.type;
    var p_openid = e.currentTarget.dataset.p_openid
    wx.navigateTo({
      url: '/pages/hotel/order/index?merchant_id' + merchant_id + '&order_status=' + status + "&type=" + type + '&openid=' + p_openid,
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
    var that = this;
    utils.PostRequest(api_v_url + '/purchase/userList', {
      openid: openid,
      merchant_id: merchant_id,
      page: page,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        userList: data.result.datalist
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

  }
})