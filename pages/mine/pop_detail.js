// pages/mine/pop_detail.js
const app = getApp()
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    boxArray: ['北京'],
    objectBoxArray: [],
    boxIndex: 0,
    is_box:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that = this;
    var goods_id = options.goods_id;
    
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    var hotel_has_room = user_info.hotel_has_room;
    var hotel_id = user_info.hotel_id;
    that.setData({
      hotel_has_room: hotel_has_room,
      goods_id:goods_id,
      user_info:user_info,
    })
    //商品详情
    wx.request({
      url: api_v_url +'/goods/getdetail',
      header: {
        'content-type': 'application/json'
      },
      data:{
        goods_id:goods_id,
        uid:'BpNY'
      },
      success:function(res){
        if(res.data.code==10000){
          console.log(res);
          that.setData({
            goods_info:res.data.result
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