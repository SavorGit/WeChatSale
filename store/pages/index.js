// store/pages/index.js
/**
 * 库存管理 首页
 */
const app = getApp()
const utils = require('../../utils/util.js')
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
    hotel_list:[],  //联想搜索酒楼列表
    select_hotel_name:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideHomeButton();
    wx.hideShareMenu();
    openid = app.globalData.openid;
    this.getAllHotelList();
  },
  getAllHotelList:function(){
    var that = this;
    utils.PostRequest(api_v_url + '/hotel/getMerchantHotelList', {
      keywords: '',
    }, (data, headers, cookies, errMsg, statusCode) => {
      var all_hotel_list = data.result;
      that.setData({all_hotel_list:all_hotel_list})
    },res=>{},{isShowLoading:false})
  },
  searchHotel:function(e){
    var hotel_name = e.detail.value.replace(/\s+/g, '');
    let self = this;
    if (typeof (hotel_name) != 'string' || hotel_name.trim() === '') {
      self.setData({
        hotel_list: []
      });
      return;
    }
    let len = self.data.all_hotel_list.length;
    let arr = [];
    let reg = new RegExp(hotel_name);
    for (let i = 0; i < len; i++) {
      //如果字符串中不包含目标字符会返回-1
      if (self.data.all_hotel_list[i].hotel_name.match(reg)) {
        arr.push(self.data.all_hotel_list[i]);
      }
    }
    self.setData({
      hotel_list: arr
    });
  },
  selectMyHotel:function(e){
    var that = this;
    var index = e.target.dataset.index;
    var hotel_list = this.data.hotel_list;
    var hotel_id   = hotel_list[index].hotel_id;
    var hotel_name = hotel_list[index].hotel_name; 
    var merchant_id = hotel_list[index].merchant_id;
    console.log('/store/pages/hotel/hotelstore?openid='+openid+'&hotel_id='+hotel_id);
    
    wx.navigateTo({
      url: '/store/pages/hotel/hotelstore?openid='+openid+'&hotel_id='+hotel_id,
      success:function(){
        that.setData({hotel_list:[],select_hotel_name:''})
      }
    })
  },
  gotoPage:function(e){
    console.log(e)
    var type = e.currentTarget.dataset.type;
    var page_url = '';
    switch(type){
      case 'storein':
        page_url = '/store/pages/storein/index';
        break;
      case 'storeout':
        page_url = '/store/pages/storeout/index';
        break;
    }
    page_url +='?openid='+openid
    wx.navigateTo({
      url: page_url,
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