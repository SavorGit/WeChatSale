// crm/pages/consumer/list.js
const app = getApp()
const utils = require('../../../utils/util.js')

/**
 * 客户列表页面
 */
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
    customListPage: {
      key_words:'',
      show: true,
      enableBackup: false,
      searchPlaceholder: '输入姓名/手机号',
      topTips: {
        show: true,
        list: ['共123个客户']
      },
      data: [
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid = app.globalData.openid;
    hotel_id = options.hotel_id;
    var key_words = '';
    if(typeof(key_words)!='undefined'){
      key_words = options.key_words;
    }
    console.log(key_words);
    this.getConsumerList(openid,hotel_id,key_words);
  },
  gotoDetail:function(e){
    
    var consumer_id = e.detail.id;
    wx.navigateTo({
      url: '/crm/pages/consumer/detail?id='+consumer_id+'&hotel_id='+hotel_id,
    })
  },
  inputSearch:function(e){
    console.log(e)
  },
  searchItems:function(e){
    console.log(e)
    var key_words = e.detail.detail.value.replace(/\s+/g, '');
    
    this.getConsumerList(openid,hotel_id,key_words);
  },
  getConsumerList:function(openid,hotel_id,key_words=''){
    var that = this;
    var customListPage = that.data.customListPage;
    utils.PostRequest(api_v_url + '/customer/datalist', {
      openid           : openid,
      hotel_id         : hotel_id,
      keywords         : key_words,
    }, (data, headers, cookies, errMsg, statusCode) => {

      var data_list  = data.result.datalist;
      var total_num  = data.result.total_num;
      customListPage.data = data_list;
      customListPage.topTips.list[0] = '共'+total_num+'个客户';
      if(key_words!=''){
        customListPage.key_words = key_words
      }
      that.setData({customListPage:customListPage})
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