// pages/mine/post_book/log_detail.js


/**
 * 预定信息页
 */
const app = getApp()
var uma = app.globalData.uma;
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
const oss_url   = app.globalData.oss_url;
const oss_upload_url = app.globalData.oss_upload_url;
var openid;
var hotel_id;
var id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitation_info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid   = options.openid;
    hotel_id = options.hotel_id;
    id       = options.id;
    this.getPostBookDetail(openid,hotel_id,id);
  },
  getPostBookDetail:function(openid,hotel_id,id){
    var that = this;
    utils.PostRequest(api_v_url + '/invitation/detail', {
      hotel_id:hotel_id,
      openid:openid,
      invitation_id:id
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({invitation_info:data.result})
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