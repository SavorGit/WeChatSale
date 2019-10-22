// pages/mine/pop_list.js
const app = getApp()
var mta = require('../../utils/mta_analysis.js')
var api_url = app.globalData.api_url;
var cache_key = app.globalData.cache_key;
var openid;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pop_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    var hotel_id = user_info.hotel_id;
    if(user_info.hotel_id==-1){
      var hotel_id = user_info.select_hotel_id;
    }else{
      var hotel_id = user_info.hotel_id;
    }
    wx.request({
      url: api_url +'/Smallsale/goods/getGoodslist',
      header: {
        'content-type': 'application/json'
      },
      data: {
        hotel_id: hotel_id,
        openid: openid,
        page: 1,
        type:10
      },
      success:function(res){
        if(res.data.code==10000){
          that.setData({
            pop_list: res.data.result.datalist
          })
        }
      }
    })

  },
  loadMore: function (res) {
    var that = this;
    var userinfo = wx.getStorageSync(cache_key + 'userinfo');
    openid = userinfo.openid;
    if(userinfo.hotel_id==-1){
      var hotel_id = userinfo.select_hotel_id;
    }else{
      var hotel_id = userinfo.hotel_id;
    }
    
    page = page + 1;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: api_url + '/Smallsale/goods/getGoodslist',
      header: {
        'content-type': 'application/json'
      },
      data: {
        hotel_id:hotel_id,
        openid: openid,
        page: page,
        type:10,
      },
      success: function (res) {
        if (res.data.code == 10000) {
          that.setData({
            pop_list: res.data.result.datalist
          })
          wx.hideLoading()
        }
      }
    })
    
  },
  addPop:function(e){
    console.log(e);
    var that = this;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    var goods_id = e.currentTarget.dataset.goods_id;
    var keys = e.currentTarget.dataset.keys;
    var pop_list = that.data.pop_list;
    if(user_info.hotel_id==-1){
      var hotel_id = user_info.select_hotel_id;
    }else{
      var hotel_id = user_info.hotel_id;
    }
    
    wx.request({
      url: api_url +'/Smallsale/goods/addSalegoods',
      header: {
        'content-type': 'application/json'
      },
      data:{
        goods_id: goods_id,
        hotel_id: hotel_id,
        openid:openid
      },
      success:function(res){
        if(res.data.code==10000){
          for (var i = 0; i < pop_list.length; i++) {
            if (i == keys) {
              pop_list[i].is_add = 1;
            }
          }
          that.setData({
            pop_list: pop_list
          })
        }else {
          wx.showToast({
            title: '操作失败',
            icon:'none',
            duration:2000
          })
        }
      }
    })

    
  },
  removePop:function(e){
    console.log(e);
    var that = this;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    var goods_id = e.currentTarget.dataset.goods_id;
    var keys = e.currentTarget.dataset.keys;
    var pop_list = that.data.pop_list;
    if(user_info.hotel_id==-1){
      var hotel_id = user_info.select_hotel_id;
    }else{
      var hotel_id = user_info.hotel_id;
    }
    
    wx.request({
      url: api_url + '/Smallsale/goods/addSalegoods',
      header: {
        'content-type': 'application/json'
      },
      data: {
        goods_id: goods_id,
        hotel_id: hotel_id,
        openid: openid
      },
      success: function (res) {
        if(res.data.code==10000){
          for (var i = 0; i < pop_list.length; i++) {
            if (i == keys) {
              pop_list[i].is_add = 0;
            }
          }
          that.setData({
            pop_list: pop_list
          })
        }else {
          wx.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
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