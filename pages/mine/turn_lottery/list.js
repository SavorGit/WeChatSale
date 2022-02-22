// pages/mine/turn_lottery/list.js
/**
 * 幸运抽奖页面
 */

const app = getApp()
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var merchant_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{ name: 'xxxx酒xxxxx抽奖' }, { name: '任务中心' }, { name: '幸运抽奖' }, { name: '餐厅评价' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  // 设置发起抽奖
  setPrize: function (e) {
    let self = this;
    let index = e.currentTarget.dataset.index;
    let bean = self.data.list[index];
    self.setData({ showSetPrizeWindow: true, setPrize: bean });
  },
  // 关闭设置奖项弹窗
  closeSetPrizeWindow: function (e) {
    let self = this;
    self.setData({ showSetPrizeWindow: false });
  }
})