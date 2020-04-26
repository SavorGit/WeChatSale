// pages/forscreen/forfile/h5files.js
const util = require('../../../utils/util.js')
const app = getApp()
var api_url = app.globalData.api_url;
var openid;
var box_mac;
var mobile_brand = app.globalData.mobile_brand;
var mobile_model = app.globalData.mobile_model;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    pixelRatio: 0,
    screenHeight: 0,
    screenWidth: 0,
    windowHeight: 0,
    windowWidth: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    console.log(options);
    var that = this;
    openid = options.openid;
    box_mac = options.box_mac;
    that.setData({
      openid: openid,
      box_mac: box_mac,
      mobile_brand: mobile_brand,
      mobile_model: mobile_model,
    });
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        var web_url = api_url + "/h5/fileforscreen?source=sale&windowHeight=" + res.windowHeight + "&statusBarHeight=0&box_mac=" + box_mac + "&mobile_brand=" + mobile_brand + "&mobile_model=" + mobile_model + "&openid=" + openid;
        // var web_url = api_url + "/h5/fileforscreen?source=sale&windowHeight=" + res.windowHeight + "&statusBarHeight=" + res.statusBarHeight + "&box_mac=" + box_mac + "&mobile_brand=" + mobile_brand + "&mobile_model=" + mobile_model + "&openid=" + openid;
        web_url = encodeURI(web_url);
        console.log(web_url);
        that.setData({
          web_url: web_url,
          pixelRatio: res.pixelRatio,
          screenHeight: res.screenHeight,
          screenWidth: res.screenWidth,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        });
      }
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
    var pageObje = this;
    var pageData = pageObje.data;
    if (app.globalData.fromPage == "/pages/launch/file/h5files_result") {
      app.globalData.fromPage = "";
      var webUrl = api_url + "/h5/fileforscreen?source=sale&windowHeight=" + pageData.windowHeight + "&statusBarHeight=0&box_mac=" + pageData.box_mac + "&mobile_brand=" + pageData.mobile_brand + "&mobile_model=" + pageData.mobile_model + "&openid=" + pageData.openid + "&is_open_simple=" + pageData.is_open_simple + "&time=" + new Date().getTime();
      // var webUrl = api_url + "/h5/fileforscreen?source=sale&windowHeight=" + pageData.windowHeight + "&statusBarHeight=" + pageData.statusBarHeight + "&box_mac=" + pageData.box_mac + "&mobile_brand=" + pageData.mobile_brand + "&mobile_model=" + pageData.mobile_model + "&openid=" + pageData.openid + "&is_open_simple=" + pageData.is_open_simple + "&time=" + new Date().getTime();
      webUrl = encodeURI(webUrl);
      console.log("onShow", pageData, webUrl);
      this.setData({
        web_url: webUrl
      });
    }
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

  },

  pageLoad: function (event) {}
})