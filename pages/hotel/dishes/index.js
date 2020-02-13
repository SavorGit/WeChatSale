// pages/hotel/dishes/index.js
const app = getApp()
const mta = require('../../../utils/mta_analysis.js')
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var merchant_id ;
var openid ;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    openid = options.openid;
    merchant_id = options.merchant_id;

    //获取酒楼菜品列表
    utils.PostRequest(api_v_url + '/dish/goodslist', {
      openid: openid,
      merchant_id: merchant_id,
      page:1
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        dishes_list: data.result
      })
    })

  },
  /**
   * 加载更多
   */
  loadMore:function(e){
    var that = this;
    page +=1;
    utils.PostRequest(api_v_url + '/dish/goodslist', {
      openid: openid,
      merchant_id: merchant_id,
      page: page
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        dishes_list: data.result
      })
    })
  },
  /**
   * 菜品置顶
   */
  setTop:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var dishes_list = that.data.dishes_list;
    var top_item = dishes_list[index];
    dishes_list.splice(index,1);
    dishes_list.unshift(top_item);
    that.setData({
      dishes_list:dishes_list
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