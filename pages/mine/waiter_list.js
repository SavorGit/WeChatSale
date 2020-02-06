// pages/mine/waiter_list.js
const app = getApp()
var mta = require('../../utils/mta_analysis.js')
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: 'http://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',
    nickName: '昵称',
    score: 3.6,
    waiter_list: [
      {
        avatarUrl: 'http://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',
        nickName: '张三三'
      },
      {
        avatarUrl: 'http://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',
        nickName: '李四'
      },
      {
        avatarUrl: 'http://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',
        nickName: '王一一'
      },
      {
        avatarUrl: 'http://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',
        nickName: '高大大'
      },
      {
        avatarUrl: 'http://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',
        nickName: '赵'
      }
    ],
    showPurviewManageWindow: false// 是否显示权限管理弹窗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      score: 3.7, // 服务员所得分值
      showPurviewManageWindow: true // 是否显示权限管理弹窗
    });
    var p_user_id = options.p_user_id;
    openid = options.openid;
    utils.PostRequest(api_v_url + '/aa/bb/cc', {
      user_id: p_user_id,
      page: 1
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        water_list: data.result.datalist
      })
    })
  },
  /**
   * 移除服务员
   */
  remove_waiter: function (e) {
    var that = this;
    var user_id = e.currentTarget.dataset.user_id;
    var openid = e.currentTarget.dataset.openid;
    var index = e.currentTarget.dataset.index;
    utils.PostRequest(api_v_url + '/aa/bb/cc', {
      user_id: user_id,
      openid: openid
    }, (data, headers, cookies, errMsg, statusCode) => {
      //去掉移除的服务员 生成新的服务员列表
    })
  },
  /**
   * 查看服务员详情
   */
  waiter_detail: function (e) {
    var waiter_id = e.currentTarget.dataset.waiter_id;
    wx.navigateTo({
      url: '/pages/mine/team_member_detail?waiter_id=' + waiter_id,
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