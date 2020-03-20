// pages/hotel/setting/customer_pay.js
/**
 * 收款设置页面
 */
const app = getApp()
const mta = require('../../../utils/mta_analysis.js')
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var oss_upload_url = app.globalData.oss_upload_url;
var oss_url = app.globalData.oss_url;
var cache_key = app.globalData.cache_key;
var merchant_id;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showWXAuthLogin:false,
    is_set:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    openid = options.openid;
    merchant_id = options.merchant_id;
    utils.PostRequest(api_v_url + '/merchant/getPayee', {
      merchant_id: merchant_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var pay_info = data.result
      if(pay_info==''){
        var showWXAuthLogin = true;
        var is_set = 0
      }else{
        var showWXAuthLogin = false;
        var is_set = 1;
      }
      that.setData({
        pay_info: pay_info,
        showWXAuthLogin: showWXAuthLogin
      })
    })
  },
  resetPayInfoP:function(e){
    var that = this;
    that.setData({
      showWXAuthLogin:true
    })
  },
  onGetUserInfo: function (res) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;
    if (res.detail.errMsg == 'getUserInfo:ok') {
      wx.getUserInfo({
        success(rets) {
          var avatarUrl = rets.userInfo.avatarUrl;
          var nickName = rets.userInfo.nickName;

          utils.PostRequest(api_v_url + '/User/registerCom', {
            'openid': openid,
            'avatarUrl': avatarUrl,
            'nickName': nickName,
            'gender': rets.userInfo.gender,
            'session_key': app.globalData.session_key,
            'iv': rets.iv,
            'encryptedData': rets.encryptedData
          }, (data, headers, cookies, errMsg, statusCode) => {
            utils.PostRequest(api_v_url + '/merchant/setPayee', {
              openid: openid,
              payee_openid: openid,
            }, (data, headers, cookies, errMsg, statusCode) => {
              var pay_info = { "status": 1, "avatarUrl": avatarUrl, "nickName": nickName};
             
              that.setData({
                is_set:1,
                showWXAuthLogin:false,
                pay_info: pay_info
              })
            })
          })
          

          
          
        }
      })
      
    } 
  },
  closeAuth: function () {
    var that = this;
    that.setData({
      showWXAuthLogin: false,
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