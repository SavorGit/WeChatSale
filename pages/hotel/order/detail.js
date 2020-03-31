// pages/hotel/order/detail.js
const app = getApp()
const mta = require('../../../utils/mta_analysis.js')
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var order_id; 
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
    var that = this;
    //openid = options.openid;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    console.log(user_info)
    openid = user_info.openid;
    order_id = options.order_id
    utils.PostRequest(api_v_url + '/order/detail', {
      openid: openid,
      order_id:order_id
    }, (data, headers, cookies, errMsg, statusCode) => {

      that.setData({
        order_info: data.result,
        markers: data.result.markers
      })
    })
  },
  reFreshOrder:function(e){
    var that = this;
    utils.PostRequest(api_v_url + '/order/detail', {
      openid: openid,
      order_id: order_id
    }, (data, headers, cookies, errMsg, statusCode) => {

      that.setData({
        order_info: data.result,
        markers: data.result.markers
      })
      app.showToast('刷新成功');
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
  gotoDishDetail: function (e) {
    console.log(e)
    var goods_id = e.currentTarget.dataset.goods_id;
    wx.navigateTo({
      url: '/pages/hotel/dishes/detail?goods_id=' + goods_id,
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