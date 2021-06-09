// pages/mine/assign_waiter.js
const app = getApp()
const utils = require('../../utils/util.js')
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var hotel_id;
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
    console.log(options);
    var that = this;
    openid = options.openid;
    hotel_id = options.hotel_id;

    //获取员工包间列表
    utils.PostRequest(api_v_url + '/staff/getStaffRoomList', {
      openid: openid,
      hotel_id: hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        room_list: data.result
      })
    })
  },
  assign_waiter:function(e){
    var room_id = e.currentTarget.dataset.room_id;
    wx.navigateTo({
      url: '/pages/mine/select_waiter?room_id=' + room_id + '&manager_openid=' + openid + '&hotel_id=' + hotel_id,
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
    //获取员工保健列表
    utils.PostRequest(api_v_url + '/staff/getStaffRoomList', {
      openid: openid,
      hotel_id: hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        room_list: data.result
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