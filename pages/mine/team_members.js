// pages/mine/team_members.js
const app = getApp()
var api_url = app.globalData.api_url;
var cache_key = app.globalData.cache_key;
var page = 1;
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
    wx.request({
      url: api_url +'/Smallsale/user/employeelist',
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
  },
  loadMore: function (res) {
    var that = this;
    var userinfo = wx.getStorageSync(cache_key+'userinfo');
    page = page + 1;
    wx.showLoading({
      title: '加载中，请稍后',
    })
    wx.request({
      url: api_url + '/Smallsale/user/employeelist',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: userinfo.openid,
        page: 1,
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
    var userinfo = wx.getStorageSync(cache_key+'userinfo');
    var staff_openid = e.target.dataset.staff_openid;
    var staff_list = e.target.dataset.staff_list;
    var keys  = e.target.dataset.keys;
    var new_staff_list = [];
    var flag = 0;
    wx.request({
      url: api_url + '/Smallsale/user/removeEmployee',
      header: {
        'content-type': 'application/json'
      },
      data:{
        openid:userinfo.openid,
        staff_openid:staff_openid,
      },
      success:function(res){
        if(res.data.code==10000){
          for(i=0;i<staff_list.length;i++){
            if(i!=keys){
              new_staff_list[flag] = staff_list[i];
            }
            flag++;
          }
          that.setData({
            staff_list:new_staff_list,
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