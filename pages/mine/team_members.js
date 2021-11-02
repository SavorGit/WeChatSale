// pages/mine/team_members.js
const app = getApp()
const utils = require('../../utils/util.js')
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
    wx.hideShareMenu();
    var that = this;
    var userinfo = wx.getStorageSync(cache_key+'userinfo');
    openid = userinfo.openid;
    this.setData({userinfo:userinfo})
    this.getEmployeeList(openid,1)
  },
  getEmployeeList:function(openid,page){
    var that = this;
    utils.PostRequest(api_v_url + '/user/employeelist', {
      openid: openid,
      page:page,
      pagesize:20,
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        staff_list: data.result.datalist
      })
    })
  },
  loadMore: function (res) {
    var userinfo = wx.getStorageSync(cache_key+'userinfo');
    page = page + 1;
    this.getEmployeeList(userinfo.openid,page)
    
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
  gotoMemberDetail:function(e){
    var waiter_openid = e.target.dataset.openid;
    wx.navigateTo({
      url: '/pages/mine/team_member_detail?openid='+waiter_openid,
    })
  },
  /**
   * 设置注册用户为二级管理员
   */
  setRegisterUserRole:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var staff_list = that.data.staff_list;
    var staff_openid = staff_list[index].openid
    var userinfo = this.data.userinfo;
    wx.showModal({
      title: '提示',
      content: '确定要设置为餐厅人员吗?',
      success:function(res){
        if (res.confirm) {
          utils.PostRequest(api_v_url + '/staff/addRestaurantStaff', {
            openid:userinfo.openid,
            staff_openid:staff_openid
          }, (data, headers, cookies, errMsg, statusCode) => {
            that.getEmployeeList(userinfo.openid,page)
            app.showToast('设置成功',2000,'success');
          })
        }
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