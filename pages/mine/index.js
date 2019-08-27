// pages/mine/index.js
const app = getApp()
var api_url = app.globalData.api_url;
var cache_key = app.globalData.cache_key;
var box_mac;
var openid;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:'匿名用户',
    integral:0,
    is_open_integral:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    openid = user_info.openid;
    var role_type = user_info.role_type;
    that.setData({
      role_type:role_type
    })
    wx.request({
      url: api_url +'/Smallsale/user/center',
      header: {
        'content-type': 'application/json'
      },
      data:{
        openid:openid,
      },
      success:function(res){
        if(res.data.code==10000){
          that.setData({
            avatarUrl: res.data.result.avatarUrl,
            nickName:  res.data.result.nickName,
            integral: res.data.result.integral,
            is_open_integral: res.data.result.is_open_integral,
          })
        }
      }
    })
    wx.request({
      url: api_url +'/Smallsale/user/integralrecord',
      header: {
        'content-type': 'application/json'
      },
      data:{
        openid: openid,
        page:1,
      },
      success:function(res){
        if(res.data.code==10000){
          that.setData({
            integral_list:res.data.result.datalist
          })
        }
      }
    })
    //我的员工
    wx.request({
      url: api_url +'/Smallsale/user/employeelist',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: openid,
        page: 1,
        pageSize:5
      },
      success:function(res){
        if(res.data.code==10000){
          that.setData({
            staff_list: res.data.result.datalist
          })
        }
      }
    })
  },
  loadMore:function(res){
    var that = this;
    page = page + 1;
    wx.showLoading({
      title: '加载中，请稍后',
    })
    wx.request({
      url: api_url + '/Smallsale/user/integralrecord',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: openid,
        page: page,
      },
      success: function (res) {
        if (res.data.code == 10000) {
          that.setData({
            integral_list: res.data.result.datalist
          })
          wx.hideLoading()
        }
      }
    })
    setTimeout(function () {
      wx.hideLoading()
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none',
        duration: 2000,
      })
    }, 5000)
  },
  exchange:function(res){
    wx.navigateTo({
      url: '/pages/mine/exchange',
    })
  },
  addStaff:function(e){
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    //var qrcode_url = api_url + '/Smallsale/qrcode/inviteQrcode?openid='+user_info.openid;
    wx.request({
      url: api_url +'/Smallsale/user/invite',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: user_info.openid,
        
      },
      success:function(res){
        if(res.data.code==10000){
          that.setData({
            showAddTeamMemberPage: true,
            qrcode_url: res.data.result.qrcode_url,
            qrcode: res.data.result.qrcode,
          })
        }else {
          wx.showToast({
            title: '参数异常，请重试!',
            icon: 'none',
            duration: 2000,
          })
        }
      },
      fail:function(res){
        wx.showToast({
          title: '网络异常，请重试!',
          icon:'none',
          duration:2000,
        })
      }
    })
    
  },
  freshQrcode:function(e){
    var that  = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    wx.request({
      url: api_url + '/Smallsale/user/invite',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: user_info.openid,

      },
      success: function (res) {
        if (res.data.code == 10000) {
          that.setData({
            
            qrcode_url: res.data.result.qrcode_url,
            qrcode: res.data.result.qrcode,
          })
        } else {
          wx.showToast({
            title: '参数异常，请重试!',
            icon: 'none',
            duration: 2000,
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常，请重试!',
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },  
  closeAddStaff:function(e){
    var that = this;
    that.setData({
      showAddTeamMemberPage: false,
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
    this.onLoad()
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
  onShareAppMessage: function (e) {
    var qrcode = e.target.dataset.qrcode;
    var userinfo = wx.getStorageSync(cache_key+'userinfo');
    var title = "邀请您使用小热点销售端";
    var img_url = 'http://oss.littlehotspot.com/media/resource/GyXmE3jRNh.jpg';
    if (e.from === 'button') {
      
      // 转发成功
      // 来自页面内转发按钮
      return {
        title: title,
        path: '/pages/user/invite?q='+qrcode,
        imageUrl: img_url,
        success: function (res) {
          
        }
      }
    } 
  }
})