// pages/mine/datecenter/statistics.js
/**
 * 个人信息 - 数据统计
 */

const app = getApp()
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var openid;
var hotel_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    boot_type:1,  //开机天数  1：7天，2：15天，3：30天
    usage_type:1, //使用天数  1：30天，2：3个月，3：6个月
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    wx.hideShareMenu()
    openid   = options.openid;
    hotel_id = options.hotel_id;
    var boot_type = this.data.boot_type;
    var usage_type = this.data.usage_type;
    this.getBootInfo(openid,hotel_id,boot_type);
    this.getUsageInfo(openid,hotel_id,usage_type);
  },
  /**
   * 获取开机情况
   */
  getBootInfo:function(openid,hotel_id,type){
    var that = this;
    utils.PostRequest(api_v_url + '/hotel/boot', {
      openid: openid,
      hotel_id: hotel_id,
      type:type
    }, (data, headers, cookies, errMsg, statusCode) => {
      var boot_info = data.result;
      that.setData({boot_info:boot_info,boot_type:type})
    })
  },
  /**
   * 获取使用情况
   */
  getUsageInfo:function(openid,hotel_id,type){
    var that = this
    utils.PostRequest(api_v_url + '/hotel/usage', {
      openid: openid,
      hotel_id: hotel_id,
      type:type
    }, (data, headers, cookies, errMsg, statusCode) => {
      var usage_info = data.result;
      that.setData({usage_info:usage_info,usage_type:type})
    })
  },
  /**
   * 选择开机
   */
  selectPowerOnInfo:function(e){
    var type = e.currentTarget.dataset.type;
    var boot_type = this.data.boot_type;
    if(type==boot_type){
      return false;
    }
    this.getBootInfo(openid,hotel_id,type);
  },
  /**
   * 选择小程序使用情况
   */
  selectUseAppInfo:function(e){
    var type = e.currentTarget.dataset.type;
    var usage_type = this.usage_type;
    if(usage_type==type){
      return false
    }
    this.getUsageInfo(openid,hotel_id,type);
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