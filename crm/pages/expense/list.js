// crm/pages/expense/list.js

/**
 * 待完善消费记录页
 */
const app = getApp()
const utils = require('../../../utils/util.js')

var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
const oss_url   = app.globalData.oss_url;
const oss_upload_url = app.globalData.oss_upload_url;
var openid;
var hotel_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    perfect_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideLoading();
    openid   = app.globalData.openid;
    hotel_id = options.hotel_id;
    
  },
  getPerfectList:function(openid,hotel_id){
    var that = this;
    utils.PostRequest(api_v_url + '/customer/perfectList', {
      openid           : openid,
      hotel_id         : hotel_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      if(data.result.datalist.length==0){
        app.showToast('暂无数据');
      }
      that.setData({perfect_list:data.result.datalist});
    })
  },
  gotoPage:function(e){
    var keys = e.currentTarget.dataset.keys;
    var perfect_list = this.data.perfect_list;
    var info = perfect_list[keys];
    wx.navigateTo({
      url: '/crm/pages/expense/perfect?room_id='+info.room_id+'&name='+info.name+'&mobile='+info.mobile+'&customer_id='+info.customer_id+'&hotel_id='+hotel_id+'&book_time='+info.book_time+'&type=perfect',
    })
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
    this.getPerfectList(openid,hotel_id);

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