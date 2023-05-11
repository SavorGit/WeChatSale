// crm/pages/consumer/label.js

/**
 * 标签管理页
 */
const app = getApp()
const utils = require('../../../utils/util.js')

var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
const oss_url   = app.globalData.oss_url;
const oss_upload_url = app.globalData.oss_upload_url;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lable_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid = app.globalData.openid;
    var customer_id = options.customer_id;
    this.getLables(openid,customer_id)
  },
  getLables:function(openid,customer_id){
    var that = this;
    utils.PostRequest(api_v_url + '/customer/getLabels', {
      openid        : openid,
      customer_id  : customer_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({lable_list:data.result.datalist})
    })
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})