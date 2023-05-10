// pages/crm/index/index.js

/**
 * CRM 首页
 */
const app = getApp()
const utils = require('../../../utils/util.js')
var uma = app.globalData.uma;
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var hotel_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    hotel_id = user_info.hotel_id;
    
    this.getOpsLogList(openid,hotel_id);
  },
  getOpsLogList:function(openid,hotel_id){
    var that = this;
    utils.PostRequest(api_v_url + '/aa/bb', {
      openid           : openid,
      hotel_id         : hotel_id
    }, (data, headers, cookies, errMsg, statusCode) => {

    })
  },
  inputSearch:function(e){
    var key_words = e.detail.value.replace(/\s+/g, '');
    this.setData({key_words:key_words});
  },
  searchConsumer:function(e){
    var key_words = this.data.key_words;
    var url = '/crm/pages/consumer/list?key_words='+key_words;
    wx.navigateTo({
      url: url,
    })
  },
  gotoPage:function(e){
    var type = e.currentTarget.dataset.type;
    var url = '';
    switch(type){
     
      case 'add_consumer':
        url = '/crm/pages/consumer/add';
        break;
      case 'perfect_expense_log':
        url = '/crm/pages/expense/perfect';
        break;
      case 'consumer_list':
        url = '/crm/pages/consumer/list';
        break;
      case 'consumer_info':
        var id = e.currentTarget.dataset.id;
        url = '/crm/pages/consumer/detail?id='+id;
        break;
      case 'expense_log_detail':
        var id = e.currentTarget.dataset.id;
        url ='/crm/pages/expense/detail?id='+id;
        break;
    }
    wx.navigateTo({
      url: url,
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
    this.getTabBar().setData({
      selected: 2,
    })
    
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