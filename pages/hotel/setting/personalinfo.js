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
    mobile_disabled:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
    wx.hideShareMenu();
    openid = options.openid;
    this.isRegister(openid);
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    if(user_info.openid != openid){
        this.setData({mobile_disabled:true})
    }
    this.getOssParams();
  },
  isRegister:function(){
    var that = this;
    utils.PostRequest(api_v_url + '/User/isRegister', {
      openid: openid,
    }, (data, headers, cookies, errMsg, statusCode) => {
      var userinfo = data.result.userinfo;
      that.setData({userinfo:userinfo})
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
  editUserinfo:function(e){
    var userinfo = this.data.userinfo;
    var name = e.detail.value.name.replace(/\s+/g, '');
    var mobile = e.detail.value.mobile.replace(/\s+/g, '');
    if(name==''){
        app.showToast('请输入您的名称');
        return false;
    }
    if(!app.checkMobile(mobile)){
        app.showToast('请您输入正确的手机号');
        return false;
    }

    utils.PostRequest(api_v_url + '/user/edit', {
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
            wx.setStorageSync(cache_key+'userinfo', cache_userinfo)
            
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