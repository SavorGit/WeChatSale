// pages/mine/waiter_list.js
const app = getApp()
var mta = require('../../utils/mta_analysis.js')
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var openid;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: 'http://oss.littlehotspot.com/WeChat/MiniProgram/LaunchScreen/source/images/imgs/default.jpeg',
    nickName: '昵称',
    score: 3.6,
    waiter_list: [
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
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var p_user_id = options.p_user_id;
    utils.PostRequest(api_v_url + '/aa/bb/cc', {
      user_id: p_user_id,
      page :1
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        water_list: data.result.datalist
      })
    })
  },
  loadMore:function(e){
    var that = this;
    page +=1;
    utils.PostRequest(api_v_url + '/aa/bb/cc', {
      user_id: p_user_id,
      page: page
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        water_list: data.result.datalist
      })
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