// pages/task/prize_list.js
const utils = require('../../utils/util.js');
const app = getApp()
const api_v_url = app.globalData.api_v_url;
var page ;
var openid;
var hotel_id;
/**
 * 奖品任务列表
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showClaimWindow:false,  //收益弹窗
    choosed:true,           //是否领取了红包任务
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    page     = 1;
    openid   = options.openid;
    hotel_id = options.hotel_id;
    this.getPrizeList();
  },
  //获取已领取的红包详情
  getChoosePrizeInfo:function(e){
    var that = this;
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid: openid,
      hotel_id: hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.getAllIncome();
    })
  },
  //获取现金红包列表
  getPrizeList:function(e){
    var that = this;
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid: openid,
      hotel_id: hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      
    })
  },
  //获取所有收益
  getAllIncome:function(e){
    var that = this;
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid: openid,
      hotel_id: hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {

      
    })
  },
  //选择领取红包
  choosePrize:function(e){
    var that = this;
    var prize_id = e.currentTarget.dataset.prize_id;
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid: openid,
      hotel_id: hotel_id,
      prize_id:prize_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({choosed:true})
      that.getChoosePrizeInfo();
    })
  },
  //认领收益
  takeMyIncome:function(e){
    var that = this;
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid: openid,
      hotel_id: hotel_id,
      prize_id:prize_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      
    })
  },
  //关闭收益弹窗
  closePopIncome:function(e){
    this.setData({showClaimWindow:false})
  },
  //继续领取
  gotoPrizeDetail:function(e){
    wx.navigateTo({
      url: '/pages/task/prize_detail?openid='+openid+'&hotel_id='+hotel_id,
    })
  },
  //任务完成立即领取
  takeMyPrize:function(e){
    var that = this;
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid: openid,
      hotel_id: hotel_id,
      prize_id:prize_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({choosed:false})
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