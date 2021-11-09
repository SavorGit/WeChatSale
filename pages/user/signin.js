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
    register_info:{'name':'','mobile':'','verify_code':'','hotel_id':0,"hotel_name":'','merchant_id':''},  //注册信息
    hotel_list:[],
    addDisabled:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;
    this.getAllHotelList();
  },
  getAllHotelList:function(){
    var that = this;
    utils.PostRequest(api_v_url + '/hotel/getMerchantHotelList', {
      keywords: '',
    }, (data, headers, cookies, errMsg, statusCode) => {
      var all_hotel_list = data.result;
      that.setData({all_hotel_list:all_hotel_list})
    },res=>{},{isShowLoading:false})
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
      type:1
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
    var hotel_name = e.detail.value.replace(/\s+/g, '');
    let self = this;
    if (typeof (hotel_name) != 'string' || hotel_name.trim() === '') {
      self.setData({
        hotel_list: []
      });
      return;
    }
    let len = self.data.all_hotel_list.length;
    let arr = [];
    let reg = new RegExp(hotel_name);
    for (let i = 0; i < len; i++) {
      //如果字符串中不包含目标字符会返回-1
      if (self.data.all_hotel_list[i].hotel_name.match(reg)) {
        arr.push(self.data.all_hotel_list[i]);
      }
    }
    self.setData({
      hotel_list: arr
    });

    
    
    /*if(hotel_name==''){
      that.setData({hotel_list:[]})
    }else {
      utils.PostRequest(api_v_url + '/hotel/getMerchantHotelList', {
        keywords: hotel_name,
      }, (data, headers, cookies, errMsg, statusCode) => {
        var hotel_list = data.result;
        that.setData({hotel_list:hotel_list})
      },res=>{},{isShowLoading:false})
    }*/
    
  },
  selectMyHotel:function(e){
    var index = e.target.dataset.index;
    var register_info = this.data.register_info;
    var hotel_list = this.data.hotel_list;
    var hotel_id   = hotel_list[index].hotel_id;
    var hotel_name = hotel_list[index].hotel_name; 
    var merchant_id = hotel_list[index].merchant_id;

    register_info.hotel_id    = hotel_id;
    register_info.hotel_name  = hotel_name;
    register_info.merchant_id = merchant_id;
    this.setData({register_info:register_info,hotel_list:[]});
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
    var merchant_id = register_info.merchant_id;



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
    
    if(hotel_id==0){
      app.showToast('请选择您的所属餐厅');
      return false;
    }
    wx.getUserProfile({
      desc:'获取用户头像',
      success(rets) {
        console.log(rets);
        utils.PostRequest(api_v_url + '/login/registerLogin',{
          'avatarUrl': rets.userInfo.avatarUrl,
          'gender': rets.userInfo.gender,
          'hotel_id':hotel_id,
          'merchant_id':merchant_id,
          'mobile':mobile,
          'nickName': rets.userInfo.nickName,
          'openid': openid,
          'uname':name,
          'verify_code':verify_code,
          
          'session_key': app.globalData.session_key,
          'iv': rets.iv,
          'encryptedData': rets.encryptedData
        }, (data, headers, cookies, errMsg, statusCode) => {
          wx.setStorage({
            key: cache_key + 'userinfo',
            data: data.result,
          });
          wx.switchTab({
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