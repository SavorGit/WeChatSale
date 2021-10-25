// pages/user/signin.js
const app = getApp()
const utils = require('../../utils/util.js');
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var sms_time_djs;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_get_sms_code: 0,
    register_info:{'name':'','mobile':'','verify_code':'','hotel_id':0},  //注册信息
    hotel_list:[],
    addDisabled:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;

  },
  //输入姓名
  nameOnInput:function(res){
    var name = res.detail.value;
    var register_info = this.data.register_info;
    register_info.name = name;
    this.setData({
      register_info: register_info
    })
  },
  //输入手机号失去焦点
  mobileOnInput: function (res) {
    var mobile = res.detail.value;
    var register_info = this.data.register_info;
    register_info.mobile = mobile;
    this.setData({
      register_info: register_info
    })
  },
  //获取手机验证码
  getSmsCode: function (res) {
    var that = this;
    var mobile = res.target.dataset.mobile;
    if (mobile == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      });
      this.setData({mobile_focus:true})
      return;
    }
    var is_mobile = app.checkMobile(mobile);
    if (!is_mobile) {
      this.setData({mobile_focus:true})
      return;
    }
    utils.PostRequest(api_v_url + '/sms/sendRegisterCode', {
      mobile: mobile,
    }, (data, headers, cookies, errMsg, statusCode) => {
      sms_time_djs = 60
      that.setData({
        is_get_sms_code: 1,
        sms_time_djs: sms_time_djs
      })
      var timer8_0 = setInterval(function () {
        sms_time_djs -= 1;
        that.setData({
          sms_time_djs: sms_time_djs
        });
        if (sms_time_djs == 0) {
          that.setData({
            is_get_sms_code: 0,
          })
          clearInterval(timer8_0);
        }

      }, 1000);
    })
  },
  verifyCodeOnInput:function(res){
    var verify_code = res.detail.value;
    var register_info = this.data.register_info;
    register_info.verify_code = verify_code;
    this.setData({
      register_info: register_info
    })
  },
  //模糊搜索餐厅列表
  searchHotel:function(e){
    var that = this;
    var hotel_name = e.detail.value;
    utils.PostRequest(api_v_url + '/aa/bb', {
      hotel_name: hotel_name,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var hotel_list = data.result;
      that.setData({hotel_list:hotel_list})
    })
  },
  selectMyHotel:function(e){
    var hotel_id = e.target.dataset.hotel_id;
    var register_info = this.data.register_info;
    register_info.hotel_id = hotel_id;
    this.setData({register_info:register_info,hotel_id:[]});
  },
  onGetUserInfo:function(e){
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    var register_info = this.data.register_info;
    console.log(register_info);
    var name        = register_info.name.replace(/\s+/g, '');
    var mobile      = register_info.mobile.replace(/\s+/g, '');
    var verify_code = register_info.verify_code.replace(/\s+/g, '');
    var hotel_id    = register_info.hotel_id;

    if(name==''){
      app.showToast('请填写您的姓名');
      this.setData({pname_focus:true})
      return false;
    }
    if(!app.checkMobile(mobile)){
      app.showToast('请填写正确的手机号');
      this.setData({mobile_focus:true});
      return false;
    }
    if(verify_code==''){
      app.showToast('请填写验证码');
      this.setData({verify_code_focus:true});
      return false;
    }
    
    /*if(hotel_id==0){
      app.showToast('请选择您的所属餐厅');
      return false;
    }*/
    wx.getUserProfile({
      desc:'获取用户头像',
      success(rets) {
        console.log(rets);
        utils.PostRequest(api_v_url + '/User/registerCom',{
          'openid': openid,
          'avatarUrl': rets.userInfo.avatarUrl,
          'nickName': rets.userInfo.nickName,
          'gender': rets.userInfo.gender,
          'session_key': app.globalData.session_key,
          'iv': rets.iv,
          'encryptedData': rets.encryptedData
        }, (data, headers, cookies, errMsg, statusCode) => {
          wx.setStorage({
            key: cache_key + 'userinfo',
            data: data.result,
          });
          wx.reLaunch({
            url: '/pages/user/sellindex',
          })
        })
      },fail:function(){
        utils.PostRequest(api_v_url +'/User/refuseRegister',{
          'openid': openid,
        }, (data, headers, cookies, errMsg, statusCode) => {
          user_info.is_wx_auth = 1;
          wx.setStorage({
            key: cache_key + 'userinfo',
            data: user_info,
          });
        })
        
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