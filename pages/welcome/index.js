// pages/welcome/index.js
const utils = require('../../utils/util.js')
const app = getApp()
var api_url = app.globalData.api_url;
var cache_key = app.globalData.cache_key;
var hotel_id;
var openid;
var page = 1;
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
    var that = this;
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    openid = user_info.openid;
    if (user_info.hotel_id == -1) {
      hotel_id = user_info.select_hotel_id;
    } else {
      hotel_id = user_info.hotel_id;
    }

    utils.PostRequest(api_url + '/aa/bb/cc', {
      page: page,
      hotel_id:hotel_id
    }, (data, headers, cookies, errMsg, statusCode) => {
      
      that.setData({
        list:data.result,
      })
    });
  },
  /**
   * 停止播放
   */
  stopPlay:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    utils.PostRequest(api_url + '/aa/bb/cc', {
      openid: openid,
      hotel_id: hotel_id,
      id: id,
      type:2
    }, (data, headers, cookies, errMsg, statusCode) => {
      list[index].type = 2;
      that.setData({
        list: list,
      })
    });
  },
  
  /**
   * 立即播放
   */
  startPlay:function(e){ 
    var that = this;
    var id = e.currentTarget.datase.id;
    var index = e.currentTarget.dataset.index;
    utils.PostRequest(api_url + '/aa/bb/cc', {
      openid: openid,
      hotel_id: hotel_id,
      id: id,
      type:1
    }, (data, headers, cookies, errMsg, statusCode) => {
      list[index].type=1;
      that.setData({
        list: list,
      })
    });
  },
  /**
   * 删除
   */
  delItem:function(e){
    var that  = this;
    var index = e.currentTarget.dataset.index;
    var id    = e.currentTarget.datase.id;
    var list  = that.data.list;
    utils.PostRequest(api_url + '/aa/bb/cc', {
      openid: openid,
      hotel_id: hotel_id,
      id:id
    }, (data, headers, cookies, errMsg, statusCode) => {

      list.splice(index, 1);
      that.setData({
        list: list,
      })  
    });

    
  },

  /**
   * 新建欢迎词
   */
  createWelcome:function(e){
    wx.navigateTo({
      url: '/pages/welcome/hotel_add',
    })
  },
  /**
   * 分页加载列表
   */
  loadMore:function(e){
    var that = this;
    page +=1;
    utils.PostRequest(api_url+'/aa/bb/cc',{
      openid:openid,
      hotel_id:hotel_id,
      page: page
    }, (data, headers, cookies, errMsg, statusCode)=>{
      that.setData({
        list: list,
      })
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