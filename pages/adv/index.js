// pages/adv/index.js
const app = getApp()
const utils = require('../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var box_mac = '';
var openid  = '';
var pageNum = 1;
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
    box_mac = options.boxShow;
    openid  = options.openid;
    utils.PostRequest(api_v_url + '/adv/getAdvList', {
      
      page: pageNum,
    }, (data, headers, cookies, errMsg, statusCode) => {
      console.log(data)
      that.setData({
        adv_list:data.result
      })
    });
  },
  loadMore:function(e){
    var that = this;
    pageNum +=1;
    utils.PostRequest(api_url + '/aa/bb/cc', {
      page: pageNum,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        adv_list:data.result
      })
    });
  },
  boxShow:function(e){
    var that = this;
    var forscreen_url = e.currentTarget.dataset.forscreen_url;
    var file_name     = e.currentTarget.dataset.file_name;
    var forscreen_id = (new Date()).valueOf();
    utils.PostRequest(api_url + '/Netty/Index/index', {
      box_mac: box_mac,
      msg: '{ "action": 5,"url":"' + forscreen_url + '","filename":"' + filename + '","forscreen_id":' + forscreen_id + ',"resource_id":' + forscreen_id + ',"openid":"'+openid+'"}',
    }, (data, headers, cookies, errMsg, statusCode) => {
      
      app.showToast('点播成功，电视即将播放');
      var mobile_brand = app.globalData.mobile_brand;
      var mobile_model = app.globalData.mobile_model;
      utils.PostRequest(api_url + '/Smallapp/index/recordForScreenPics', {
        forscreen_id: timestamp,
        openid: openid,
        box_mac: box_mac,
        action: 5,
        mobile_brand: mobile_brand,
        mobile_model: mobile_model,
        forscreen_char: '',
        imgs: '["'+forscreen_url+'"]',
        small_app_id: 5,
      }, (data, headers, cookies, errMsg, statusCode) => {

        }, res => { }, { isShowLoading: false })
    });
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