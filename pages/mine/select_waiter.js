// pages/mine/select_waiter.js
const app = getApp()
var mta = require('../../utils/mta_analysis.js')
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var room_id;
var manager_openid;
var hotel_id = hotel_id;
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
    room_id = options.room_id;
    manager_openid = options.manager_openid;
    utils.PostRequest(api_v_url + '/aa/bb/cc', {
      openid: manager_openid,
      hotel_id: hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        waiter_list: data.result.datalist
      })
    })
  },
  selectWaiter:function(e){
    var user_id = e.currentTarget.dataset.user_id;
    utils.PostRequest(api_v_url + '/aa/bb/cc', {
      manager_openid: manager_openid,
      user_id: user_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      app.showToast('选择成功');
      wx.navigateBack({
        delta: 1
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