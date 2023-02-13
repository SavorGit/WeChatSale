// pages/hotel/setting/personalinfo.js
/**
 * 个人基本信息页面
 */

const app = getApp()
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var oss_upload_url  = app.globalData.oss_upload_url;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SystemInfo: app.SystemInfo,
    addDisabled:false,
    mobile_disabled:true,
    is_my :true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu();
    if(typeof(options.is_auth)!='undefined'){
      var is_auth = options.is_auth
    }else {
      var is_auth = 0;
    }
    if(typeof(options.is_my)!='undefined'){
      var is_my = options.is_my;
    }else {
      var is_my = true;
    }

    if(is_auth==1){
      wx.hideHomeButton()
    }
    this.setData({is_auth:is_auth,is_my:is_my});
    openid = options.openid;
    this.isRegister(openid,is_auth);
    
    this.getOssParams();
  },
  isRegister:function(openid){
    var that = this;
    utils.PostRequest(api_v_url + '/User/isRegister', {
      openid: openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var userinfo = data.result.userinfo;
      var mobile    = data.result.userinfo.mobile
      var wxinfo   = data.result.wxinfo;

      //var user_info = wx.getStorageSync(cache_key + 'userinfo');
      
      if(userinfo.openid != openid){
        that.setData({mobile_disabled:true,is_my:false})
      }else {
        var is_my = that.data.is_my;
        if(is_my==true){
          wx.setStorageSync(cache_key + 'userinfo', userinfo)
        }
        
      }
      that.setData({userinfo:userinfo,wxinfo:wxinfo,mobile:mobile})
    })
  },
  getOssParams:function(){
    var that = this;
    wx.request({
      url: api_url + '/Smallapp/Index/getOssParams',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (rest) {
        var policy = rest.data.policy;
        var signature = rest.data.signature;
        that.setData({policy:policy,signature:signature})
      }
    })
  },
  onChooseAvatar:function(e){
    var policy = this.data.policy;
    var signature = this.data.signature;
    var avatarUrl = e.detail.avatarUrl;

    wx.showLoading({
      title: '图片上传中...',
      mask: true
    })
    this.setData({
      addDisabled: true
    })
    this.uploadImg(avatarUrl,policy,signature);
  },
  uploadImg:function(filename,policy,signature){
    var that = this;

    var index1 = filename.lastIndexOf(".");
    var index2 = filename.length;
    var timestamp = (new Date()).valueOf();
    var postf = filename.substring(index1, index2);//后缀名\
    var postf_t = filename.substring(index1, index2);//后缀名
    var postf_w = filename.substring(index1 + 1, index2);//后缀名

    var img_url = timestamp + postf;
    wx.uploadFile({
      url: oss_upload_url,
      filePath: filename,
      name: 'file',
      header: {
        'Content-Type': 'image/' + postf_w
      },
      formData: {
        Bucket: "redian-produce",
        name: img_url,
        key: "forscreen/resource/" + img_url,
        policy: policy,
        OSSAccessKeyId: app.globalData.oss_access_key_id,
        sucess_action_status: "200",
        signature: signature

      },

      success: function (res) {
        var userinfo = that.data.userinfo;

        var avatarUrl = app.globalData.oss_url+"/forscreen/resource/" + img_url
        userinfo.avatarUrl = avatarUrl
        that.setData({userinfo:userinfo})
        
        wx.hideLoading();
        setTimeout(function () {
          that.setData({
            addDisabled: false
          })
        }, 1000);
      },
      fail: function ({ errMsg }) {
        wx.hideLoading();
        app.showToast('图片上传失败，请重试')
        that.setData({
          addDisabled: false
        })
      },
    });

  },
  changeNickname:function(e){
    console.log(e)
  },
  getPhoneNumber:function(e){
    var that = this;
    if ("getPhoneNumber:ok" != e.detail.errMsg) {
      app.showToast('获取用户手机号失败')
      return false;
    }
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    //var userinfo = that.data.userinfo;
    utils.PostRequest(api_v_url + '/user/bindAuthMobile', {
      openid:openid,
      iv: iv,
      encryptedData: encryptedData,
      session_key: app.globalData.session_key,
    }, (data, headers, cookies, errMsg, statusCode) => {

      //更新缓存
      //var userinfo = wx.getStorageSync(cache_key + 'userinfo');
      
      //userinfo.mobile = data.result.purePhoneNumber;
      
      //wx.setStorageSync(cache_key + 'userinfo', userinfo)
      var mobile = data.result.purePhoneNumber;
      that.setData({
        mobile:mobile
      })
      
    })
  },


  editUserinfo:function(e){
    var userinfo = this.data.userinfo;
    var wxinfo   = this.data.wxinfo;
    console.log(e.detail.value)
    var name = e.detail.value.name.replace(/\s+/g, '');
    //var mobile = e.detail.value.mobile
    var mobile = this.data.mobile
    if(userinfo.avatarUrl==wxinfo.avatarUrl || userinfo.avatarUrl==''){
      app.showToast('请设置您的头像');
      return false;
    }
    
    if(name==wxinfo.nickName){
      app.showToast('请设置您的名称');
      return false;
    }

    if(name==''){
        app.showToast('请输入您的名称');
        return false;
    }
    console.log(mobile)
    if(mobile==''){
        app.showToast('请微信授权获取您的手机号');
        return false;
    }
    if(!app.checkMobile(mobile)){
        app.showToast('请您输入正确的手机号');
        return false;
    }
    var is_auth = this.data.is_auth;
    utils.PostRequest(api_v_url + '/user/perfect', {
      openid: openid,
      avatar_url:userinfo.avatarUrl,
      name   : name,
      mobile:mobile
    }, (data, headers, cookies, errMsg, statusCode) => {
        app.showToast('修改成功',2000,'success');
        var cache_userinfo = wx.getStorageSync(cache_key+'userinfo');
        if(cache_userinfo!='' && cache_userinfo.openid==userinfo.openid){
            cache_userinfo.avatarUrl = userinfo.avatarUrl;
            cache_userinfo.nickName  = name;
            cache_userinfo.mobile    = mobile;
            cache_userinfo.is_wx_auth = 3;
            cache_userinfo.is_perfect = 1;
            wx.setStorageSync(cache_key+'userinfo', cache_userinfo)
            if(is_auth==1){
              if(userinfo.role_type==3){
                wx.redirectTo({
                  url: '/pages/waiter/home',
                })
              }else {
                wx.switchTab({
                  url: '/pages/user/sellindex',
                })
              }
              
            }else {
              wx.navigateBack({
                delta: 1
              })
            }
        }else {
          wx.switchTab({
            url: '/pages/user/sellindex',
          })
        }
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