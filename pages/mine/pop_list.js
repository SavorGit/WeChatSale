// pages/mine/pop_list.js
const app = getApp()
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
    wx.request({
      url: api_url+'/aa/bb/cc',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: openid,
        page: 1,
      },
      success:function(res){
        if(res.data.code==10000){
          that.setData({
            pop_list:res.data.result
          })
        }
      }
    })

  },
  loadMore: function (res) {
    var that = this;
    var userinfo = wx.getStorageSync(cache_key + 'userinfo');
    openid = userinfo.openid;
    page = page + 1;
    wx.showLoading({
      title: '数据加载中，请稍后',
    })
    wx.request({
      url: api_url + '/aa/bb/cc',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: openid,
        page: page,
      },
      success: function (res) {
        if (res.data.code == 10000) {
          that.setData({
            pop_list: res.data.result
          })
          wx.hideLoading()
        }
      }
    })
    setTimeout(function () {
      wx.hideLoading()
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none',
        duration: 2000,
      })
    }, 5000)
  },
  addPop:function(e){
    var that = this;
    var keys = e.target.dataset.keys;
    var pop_list = that.data.pop_list;
    for(var i=0;i<pop_list.length;i++){
      if(i==keys){
        pop_list[i].is_add = 1;
      }
    }
    that.setData({
      pop_list: pop_list
    })
  },
  removePop:function(e){
    var that = this;
    var keys = e.target.dataset.keys;
    var pop_list = that.data.pop_list;
    for (var i = 0; i < pop_list.length; i++) {
      if (i == keys) {
        pop_list[i].is_add = 0;
      }
    }
    that.setData({
      pop_list: pop_list
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