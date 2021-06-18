// pages/activity/profit_list.js 

const app = getApp()
const utils = require('../../utils/util.js')
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var hotel_id;
var openid;
var page;
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
    page = 1;
    hotel_id = options.hotel_id;
    openid   = options.openid;
  },
  getActivityList:function(page = 1){
    var that = this;
    utils.PostRequest(api_v_url + '/activity/getJuactivityList', {
      hotel_id: hotel_id,
      openid:openid,
      page : page
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        activity_list:data.result.datalist
      })
    })
  },
  //添加活动
  addActivity:function(e){
    wx.navigateTo({
      url: '/pages/activity/profit_add?hotel_id='+hotel_id+'&openid='+openid,
    })
  },
  //分页加载
  loadMore:function(e){
    page +=1;
    this.getActivityList(page);
  },
  startActivity:function(e){
    var that = this;
    var activity_id = e.currentTarget.dataset.activity_id;
    var keys        = e.currentTarget.dataset.keys;
    var activity_list = this.data.activity_list;

    wx.showModal({
      title: '确定要开始吗？',
      //content: '当前电视正在进行投屏,继续投屏有可能打断当前投屏中的内容.',
      success: function (res) {
        if (res.confirm) {
          utils.PostRequest(api_v_url + '/activity/startJuactivity', {
            hotel_id: hotel_id,
            openid:openid,
            activity_id : activity_id
          }, (data, headers, cookies, errMsg, statusCode) => {
            activity_list[keys].status = "1";
            activity_list[keys].status_str = '进行中';
            that.setData({activity_list:activity_list})
          })
        }
      }
    })
  },
  gotoActivityDetail:function(e){
    var activity_id = e.currentTarget.dataset.activity_id;
    wx.navigateTo({
      url: '/pages/activity/profit_detail?activity_id='+activity_id+'&hotel_id='+hotel_id+'&openid='+openid,
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
    this.getActivityList(page);
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