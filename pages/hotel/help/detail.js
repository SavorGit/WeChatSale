// pages/hotel/help/detail.js
/**
 * 酒楼帮助详情页面
 */
const app = getApp()
const utils = require('../../../utils/util.js')
var api_v_url = app.globalData.api_v_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '电视节目如何切换',
    videoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var hotel_id = options.hotel_id;
    this.getTvHelpvideos(hotel_id);
  },
  getTvHelpvideos:function(hotel_id){
    var that = this;
    utils.PostRequest(api_v_url +'/hotel/tvHelpvideos',{
      hotel_id : hotel_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        videoList:data.result.datalist,
      })
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

  }
})