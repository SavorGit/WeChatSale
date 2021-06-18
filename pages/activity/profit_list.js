// pages/activity/profit_list.js 

const app = getApp()
const utils = require('../../utils/util.js')
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var hotel_id;
var openid;
var page;
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
    page = 1;
    hotel_id = options.hotel_id;
    openid   = options.openid;
    this.getActivityList();
  },
  getActivityList:function(page = 1){
    var that = this;
    utils.PostRequest(api_v_url + '/activity/getJuactivityList', {
      hotel_id: hotel_id,
      openid:openid,
      page : page
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        activity_list:data.result.datalist
      })
    })
  },
  //添加活动
  addActivity:function(e){
    wx.navigateTo({
      url: '/pages/activity/profit_add?hotel_id='+hotel_id+'&openid='+openid,
    })
  },
  //分页加载
  loadMore:function(e){
    page +=1;
    this.getActivityList(page);
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
    this.getActivityList(page);
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