// pages/mine/message/index.js
/**
 * 消息通知首页
 */

const app = getApp()
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
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
    let self = this;
    self.setData({
      list: [{
        title: '品鉴酒领取通知',
        time: '2021.9.29 11:30',
        user_name: '张三三',
        user_header: 'https://oss.littlehotspot.com/WeChat/resource/default.jpg',
        msg: '成功领取了品鉴酒“xxxxxxxxxxxxxxxxxx“，请及时处理。'
      }, {
        title: '品鉴酒领取通知',
        time: '2021.9.29  11:20',
        user_name: '李四四',
        user_header: 'https://oss.littlehotspot.com/WeChat/resource/default.jpg',
        msg: '成功领取了品鉴酒“xxxxxxxxxxxxxxxxxx“，请及时处理。'
      }]
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

  }
})