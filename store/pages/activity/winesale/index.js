// store/pages/activity/winesale/index.js

/**
 * 售酒抽奖
 */
const app = getApp()
const utils = require('../../../../utils/util.js')
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipList: ['请问是否卖出以下商品？', '如确认无误可发起抽奖！'],
    list: [{
      stock_id: 123,
      goods_id: 456,
      name: '测试一下下',
      cate_name: '白酒',
      sepc_name: '500ml',
      unit_name: '瓶'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
console.log(app.SystemInfo)
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