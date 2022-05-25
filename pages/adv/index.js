// pages/adv/index.js
const app = getApp()
const utils = require('../../utils/util.js')
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var box_mac = '';
var openid  = '';
var hotel_id= '';
var pageNum = 1;
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
    wx.hideShareMenu();
    console.log(options);
    var that = this;
    box_mac = options.box_mac;
    openid  = options.openid;
    hotel_id = options.hotel_id;
    that.setData({
      box_mac:box_mac,
      openid:openid,
      hotel_id:hotel_id
    })  
    utils.PostRequest(api_v_url + '/adv/getResList', {
      page: pageNum,
      hotel_id:hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        adv_list:data.result.datalist
      })
    });
  },
  loadMore:function(e){
    var that = this;
    pageNum +=1;
    utils.PostRequest(api_v_url + '/adv/getResList', {
      page: pageNum,
      hotel_id:hotel_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        adv_list:data.result.datalist
      })
    });
  },
  boxShow:function(e){
    var that = this;
    var pubdetail = e.currentTarget.dataset.pubdetail;
    var action =5;
    
    console.log(pubdetail);
    app.boxShow(box_mac,pubdetail,2,action,that);
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