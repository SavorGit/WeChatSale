// pages/reward/integral_detail.js
//积分明细
const app = getApp()
const utils = require('../../utils/util.js')
var mta = require('../../utils/mta_analysis.js')
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    integralDateObjectArr: [],
    integralDateNameArr: [],
    integralDateIndex: 0,
    profit_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that = this;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    page = 1;
    utils.PostRequest(api_v_url + '/user/assigntypes', {
      openid: openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var idate = data.result.date_list[data.result.date_key].id;
      that.setData({
        integralDateObjectArr:data.result.date_list,
        integralDateNameArr:data.result.date_name_list,
        integralDateIndex: data.result.date_key,
        idate:idate,
      })
      that.getIntegralList(idate,openid,page);
    })
    
  },
  getIntegralList:function(idate,openid,page=1){
    var that = this;
    utils.PostRequest(api_v_url + '/user/rewardmoneyrecord', {
      idate:idate,
      openid: openid,
      page:page,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({profile_list:data.result.datalist})
    })
  },
  //选择时间
  bindDatePickerChange:function(e){
    var that = this;
    page =1
    //var box_list = that.data.objectCityArray;
    var picDateIndex = e.detail.value //切换之后城市key
    var integralDateIndex = that.data.integralDateIndex; //切换之前城市key
    if (picDateIndex != integralDateIndex) {
      that.setData({
        integralDateIndex: picDateIndex,
      })
      var idate = that.data.integralDateObjectArr[picDateIndex].id;
      that.getIntegralList(idate,openid,page);
    }
  },
  loadMore:function(e){
    page +=1;
    var idate = this.data.idate
    this.getIntegralList(idate,openid,page);
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