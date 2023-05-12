// crm/pages/consumer/detail.js

/**
 * 客户信息页
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
var id ;
var page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    consumer_info:{},
    lable_list:[],
    expense_list:[],
    popRemarkWind:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    openid = app.globalData.openid;
    id = options.id;
    hotel_id = options.hotel_id;
    page =1 ;
  },
  getConsumerInfo:function(openid,id){
    var that = this;
    utils.PostRequest(api_v_url + '/customer/detail', {
      openid           : openid,
      customer_id      : id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var consumer_info = data.result;
      that.setData({consumer_info:consumer_info});
      that.getLabels(openid,id);
      that.getRecordList(openid,id,1);

    })
  },
  getLabels:function(openid,id){
    var that = this ;
    utils.PostRequest(api_v_url + '/customer/getLabels', {
      openid           : openid,
      customer_id      : id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({lable_list:data.result.datalist});
    })
  },
  getRecordList:function(openid,id,page=1){
    var that = this;
    utils.PostRequest(api_v_url + '/customer/getRecordList', {
      openid           : openid,
      customer_id      : id,
      page             : page,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var expense_list = data.result.datalist;
      that.setData({expense_list:expense_list})
    })
    
  },
  phonecallevent: function (e) {
    console.log(e)
    
    var tel = e.currentTarget.dataset.del;
    var tel2 = e.currentTarget.dataset.del1;
    
    if(tel==''){
      tel = tel2;
    }
    wx.makePhoneCall({
      phoneNumber: tel
    })
  
  },
  opsRemarkWind:function(e){
    var type = e.currentTarget.dataset.type;
    var is_pop = type==1?true:false;
    this.setData({popRemarkWind:is_pop})
  },
  editRemark:function(e){
    console.log(e)
    var that = this;
    var consumer_info = this.data.consumer_info;
    var remark = e.detail.value.remark;
    utils.PostRequest(api_v_url + '/customer/editRemark', {
      openid           : openid,
      customer_id      : id,
      remark           : remark,
    }, (data, headers, cookies, errMsg, statusCode) => {
      
      consumer_info.remark = remark;
      that.setData({consumer_info:consumer_info,popRemarkWind:false})
    })
    
  },
  gotoPage:function(e){
    var type = e.currentTarget.dataset.type;
    var consumer_info = this.data.consumer_info;
    var url = '';
    switch(type){
      case 'edit':
        url = '/crm/pages/consumer/add?id='+id+'&hotel_id='+hotel_id;
        break;
      case 'lables':
        url = '/crm/pages/consumer/label?customer_id='+id+'&hotel_id='+hotel_id+'&is_save=1';
        break;
      case 'expense_detail':
        var expense_record_id = e.currentTarget.dataset.expense_record_id;
        url = '/crm/pages/expense/detail?expense_record_id='+expense_record_id;
        break;
      case 'add_expense':
        url ='/crm/pages/expense/perfect?room_id=0&name='+consumer_info.name+'&mobile='+consumer_info.mobile+'&customer_id='+id+'&hotel_id='+hotel_id+'&book_time=&type=add';
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
    this.getConsumerInfo(openid,id);
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