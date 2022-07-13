// store/pages/couponbreakage/havecode/index.js

/**
 * 新增核销申请-优惠券
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
    listTitle: '已扫优惠券（2）',
    scanList: [{
      idcode: 'aaaaaaaaaaaaaaaaaaaaaaaaa',
      add_time: '2022/04/10 11:00:50'
    }, {
      idcode: 'bbbbbbbbbbbbbbbbbbbbb',
      add_time: '2022/04/10 11:00:40'
    }],
    datas: [{
      img_url: '',
      is_required: 1,
      name: '酒水小票'
    }, {
      img_url: '',
      is_required: 1,
      name: '瓶盖照片'
    }, {
      img_url: '',
      is_required: 1,
      name: '其他'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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