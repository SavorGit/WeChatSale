// pages/user/authorization.js

/**
 * 强制授权页面
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

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    openid = app.globalData.openid;
    this.isRegister(openid);
  },
  isRegister:function(openid){
    var that = this;
    utils.PostRequest(api_v_url + '/User/isRegister',{
      openid:openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var user_info = data.result.userinfo;
      that.setData({user_info:user_info});
    })
  },
  onGetUserInfo: function (res) {
    var that = this;
    var user_info = that.data.user_info;
    uma.trackEvent('clickonwxauth',{'open_id':openid})
    wx.getUserProfile({
      desc:'获取用户头像',
      success(rets) {
        var avatarUrl = rets.userInfo.avatarUrl;
        var nickName = rets.userInfo.nickName;

        utils.PostRequest(api_v_url + '/User/registerCom',{
          'openid': openid,
            'avatarUrl': rets.userInfo.avatarUrl,
            'nickName': rets.userInfo.nickName,
            'gender': rets.userInfo.gender,
            'session_key': app.globalData.session_key,
            'iv': rets.iv,
            'encryptedData': rets.encryptedData
        }, (data, headers, cookies, errMsg, statusCode) => {
          
          
          var mobile = data.result.mobile;
          
          if(mobile!=''){
            wx.setStorage({
              key: cache_key + 'userinfo',
              data: data.result,
            });
            wx.switchTab({
              url: '/pages/user/sellindex',
            })
          }else {
            var user_info = data.result;
            that.setData({user_info:user_info});
          }

          uma.trackEvent('wxauthsucess',{'open_id':openid})
        })
        
      },fail:function(){
        wx.request({
          url: api_v_url + '/User/refuseRegister',
          header: {
            'content-type': 'application/json'
          },
          data: {
            openid: openid
          },
          success: function () {
            user_info.is_wx_auth = 1;
            that.setData({user_info:user_info});
          }
        })
        uma.trackEvent('refusewxauth',{'open_id':openid})
      }
    })
  },
  getPhoneNumber:function(e){
    var that = this;
    if ("getPhoneNumber:ok" != e.detail.errMsg) {
      app.showToast('获取用户手机号失败')
      return false;
    }
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    utils.PostRequest(api_v_url + '/user/bindAuthMobile', {
      openid:openid,
      iv: iv,
      encryptedData: encryptedData,
      session_key: app.globalData.session_key,
    }, (data, headers, cookies, errMsg, statusCode) => {

      //更新缓存
      var user_info = wx.getStorageSync(cache_key + 'userinfo');
      user_info.mobile = data.result.purePhoneNumber;
      user_info.is_wx_auth = 3;
      wx.setStorageSync(cache_key + 'userinfo', user_info)
      that.setData({
        user_info:user_info
      })
      wx.switchTab({
        url: '/pages/user/sellindex',
      })
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