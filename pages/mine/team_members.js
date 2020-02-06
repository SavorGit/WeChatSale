// pages/mine/team_members.js
const app = getApp()
var mta = require('../../utils/mta_analysis.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var page = 1;
var openid ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staff_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userinfo = wx.getStorageSync(cache_key+'userinfo');
    openid = userinfo.openid;
    wx.request({
      url: api_v_url +'/user/employeelist',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: userinfo.openid,
        page:1,
        pagesize:20,
      },
      success:function(res){
        that.setData({
          staff_list: res.data.result.datalist
        })
      }
    })
    this.setData({
      staff_list: [
        {
          avatarUrl: 'http://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',
          nickName: '张三三'
        },
        {
          avatarUrl: 'http://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',
          nickName: '李四'
        },
        {
          avatarUrl: 'http://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',
          nickName: '王一一'
        },
        {
          avatarUrl: 'http://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',
          nickName: '高大大'
        },
        {
          avatarUrl: 'http://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',
          nickName: '赵'
        }
      ]});
  },
  loadMore: function (res) {
    var that = this;
    var userinfo = wx.getStorageSync(cache_key+'userinfo');
    page = page + 1;
    wx.showLoading({
      title: '加载中，请稍后',
    })
    wx.request({
      url: api_v_url + '/user/employeelist',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: userinfo.openid,
        page: page,
        pagesize: 20,
      },
      success: function (res) {
        if (res.data.code == 10000) {
          that.setData({
            staff_list: res.data.result.datalist
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
  removeStaff:function(e){
    var that  =  this;
    var userinfo = wx.getStorageSync(cache_key+'userinfo');
    var openid = e.target.dataset.openid;
    var invite_id = e.target.dataset.invite_id;
    var staff_list = e.target.dataset.staff_list;
    var keys  = e.target.dataset.keys;
    var new_staff_list = [];
    var flag = 0;
    wx.request({
      url: api_v_url + '/user/removeEmployee',
      header: {
        'content-type': 'application/json'
      },
      data:{
        openid: openid,
        invite_id: invite_id,
      },
      success:function(res){
        if(res.data.code==10000){
          
          wx.showToast({
            title: '移除成功',
            icon: 'none',
            duration: 2000,
          })
          
          staff_list.splice(keys,1)
          that.setData({
            staff_list: staff_list
          })
          
        }else {
          wx.showToast({
            title: '移除失败，请重试',
            icon: 'none',
            duration: 2000,
          })
        }
      },
      fail:function(res){
        wx.showToast({
          title: '移除失败，请重试',
          icon:'none',
          duration:2000,
        })
      },complete:function(res){
        
      }
    })
  },
  /**
   * 查看我的服务员列表
   */
  waiter_list:function(e){
    var invite_id = e.currentTarget.dataset.invite_id;
    var userinfo = wx.getStorageSync(cache_key + 'userinfo');
    var openid = e.target.dataset.openid;
    wx.navigateTo({
      url: '/pages/mine/waiter_list?p_user_id=' + invite_id + '&openid=' + openid,
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
    mta.Event.stat('clickStaffList', { 'openid': openid })
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