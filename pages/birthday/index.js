// pages/birthday/index.js
const utils = require('../../utils/util.js')
var mta = require('../../utils/mta_analysis.js')
const app = getApp()
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var hotel_id;
var box_mac;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    play_key:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu();
    var that = this;
    var link_user_info = wx.getStorageSync(cache_key + "link_box_info");
    if (typeof(link_user_info.box_mac) == 'undefined') {
      wx.showModal({
        title: '提示',
        content: '请您先连接包间电视',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    } else {
      var user_info = wx.getStorageSync(cache_key + 'userinfo');
      openid = user_info.openid;
      box_mac = link_user_info.box_mac;
      utils.PostRequest(api_url + '/Smallapp21/index/happylist', {

      }, (data, headers, cookies, errMsg, statusCode) => {
        console.log(data.result);
        that.setData({
          happylist: data.result,
        })
      });
    }
  },
  /**
   * 点播生日歌
   */
  showHappy: function(e) {
    var that = this;
    var happylist = that.data.happylist;
    var index = e.currentTarget.dataset.index;

    var filename = happylist[index].file_name;
    var vediourl = happylist[index].res_url;
    var timestamp = (new Date()).valueOf();
    var forscreen_char = 'Happy Birthday';

    utils.PostRequest(api_url + '/Netty/Index/pushnetty', {
      box_mac: box_mac,
      msg: '{ "action": 6,"url":"' + vediourl + '","filename":"' + filename + '","forscreen_id":"' + timestamp + '","resource_type":2,"openid":"'+openid+'"}',
    }, (data, headers, cookies, errMsg, statusCode) => {
      
      app.showToast('点播成功,电视即将开始播放');
      
    });
    var mobile_brand = app.globalData.mobile_brand;
    var mobile_model = app.globalData.mobile_model;
    utils.PostRequest(api_v_url + '/ForscreenLog/recordForScreenPics', {
      forscreen_id: timestamp,
      openid: openid,
      box_mac: box_mac,
      action: 5,
      mobile_brand: mobile_brand,
      mobile_model: mobile_model,
      forscreen_char: forscreen_char,
      imgs: '["media/resource/' + filename + '"]',
      small_app_id: app.globalData.small_app_id,
    }, (data, headers, cookies, errMsg, statusCode) => {

      }, res => { }, { isShowLoading: false })
    mta.Event.stat("demanhappy", {})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    
  }
})