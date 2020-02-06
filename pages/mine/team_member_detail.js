// pages/mine/team_member_detail.js
const app = getApp()
var mta = require('../../utils/mta_analysis.js')
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var user_id;
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
    var that = this;
    that.setData({
      userScore: 3.7, // 服务员所得分值
      // showPurviewManageWindow: true // 是否显示权限管理弹窗
    });
    openid = options.openid;
    user_id = options.user_id;
    utils.PostRequest(api_v_url + '/aa/bb/cc', {
      openid: openid,
      user_id: user_id,
      page: 1
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        user_info: data.result.user_info,
        pingfen_list: data.result.datalist
      })
    })
  },
  /**
   * 查询服务员某个时间段的评分列表
   */
  warterScoreList: function (e) {
    var that = this;
    var start_date = e.detail.value.start_date;
    var end_date = e.detail.value.end_date;
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid: openid,
      user_id: user_id,
      start_date: start_date,
      end_date: end_date,
      page: 1
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        pingfen_list: data.result.datalist
      })
    })
  },
  /**
   * 服务员详情评分列表分页
   */
  loadMore: function (e) {
    var that = this;
    page += 1;
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid: openid,
      user_id: user_id,
      start_date: start_date,
      end_date: end_date,
      page: page
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        pingfen_list: data.result.datalist
      })
    });
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

  },

  // 打开权限管理弹窗
  openPurviewManageWindow: function (e) {
    let self = this;
    self.setData({ showPurviewManageWindow: true });
  },

  // 关闭权限管理弹窗
  closePurviewManageWindow: function (e) {
    let self = this;
    self.setData({ showPurviewManageWindow: false });
  }
})