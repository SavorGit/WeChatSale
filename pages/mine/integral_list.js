// pages/mine/integral_list.js
const app = getApp()
var api_url = app.globalData.api_url;
var cache_key = app.globalData.cache_key;
var openid;
var page = 1;
var integral_type = 0;
var integral_date = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    integralTypeObjectArr:[],
    integralTypeNameArr:[],
    integralTypeIndex:0,
    
    integralDateObjectArr: [],
    integralDateNameArr: [],
    integralDateIndex: 0,

    totalCount:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    openid = user_info.openid;
    
    wx.request({
      url: api_url +'/Smallsale/user/integraltypes',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        if(res.data.code==10000){
          that.setData({
            integralTypeObjectArr:res.data.result.type_list,
            integralTypeNameArr:res.data.result.type_name_list,

            integralDateObjectArr:res.data.result.date_list,
            integralDateNameArr:res.data.result.date_name_list,
            integralDateIndex: res.data.result.date_key,

            
          })
        }
      }
    })
    wx.request({
      url: api_url + '/Smallsale/user/integralrecord',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: openid,
        type:0,
        idate:0,
        page: 1,
      },
      success: function (res) {
        if (res.data.code == 10000) {
          that.setData({
            integral_list: res.data.result.datalist,
            
          })
        }
      }
    })
  },
  loadMore: function (res) {
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
        type: integral_type,
        idate: integral_date,
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
  bindTypePickerChange:function(e){
    var that = this;
    page =1
    //var box_list = that.data.objectCityArray;
    var picTypeIndex = e.detail.value //切换之后城市key
    var integralTypeIndex = that.data.integralTypeIndex; //切换之前城市key

    if (picTypeIndex != integralTypeIndex) {
      that.setData({
        integralTypeIndex: picTypeIndex,
      })
      integral_type = that.data.integralTypeObjectArr[picTypeIndex].id;
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
          type: integral_type,
          idate: integral_date,
          page: page,
        },
        success: function (res) {
          if (res.data.code == 10000) {
            that.setData({
              integral_list: res.data.result.datalist
            })
            wx.hideLoading()
          }
        },fail:function(){
          wx.hideLoading()
        }
      })
      
    }
    
  },
  bindDatePickerChange:function(e){
    var that = this;
    page =1
    //var box_list = that.data.objectCityArray;
    var picDateIndex = e.detail.value //切换之后城市key
    var integralDateIndex = that.data.integralDateIndex; //切换之前城市key
    if (picDateIndex != integralDateIndex) {
      that.setData({
        integralDateIndex: picDateIndex,
      })
      integral_date = that.data.integralDateObjectArr[picDateIndex].id;
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
          type: integral_type,
          idate: integral_date,
          page: page,
        },
        success: function (res) {
          if (res.data.code == 10000) {
            that.setData({
              integral_list: res.data.result.datalist
            })
            wx.hideLoading()
          }
        }, fail: function () {
          wx.hideLoading()
        }
      })
      
    }
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