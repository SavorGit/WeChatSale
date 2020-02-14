// pages/hotel/order/index.js
const app = getApp()
const mta = require('../../../utils/mta_analysis.js')
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var merchant_id;
var openid;
var page = 1;
var page_all = 1;
var page_dealing =1 ;
var page_complete=1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_status:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    openid = options.openid
    merchant_id = options.merchant_id;
    var order_status = options.order_status
    that.setData({
      order_status:order_status
    })


    //全部订单
    utils.PostRequest(api_v_url + '/order/dishOrderlist', {
      openid: openid,
      merchant_id: merchant_id,
      page :1,
      status:0
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        all_order_list:data.result
      })
    })
    //处理中的订单
    utils.PostRequest(api_v_url + '/order/dishOrderlist', {
      openid: openid,
      merchant_id: merchant_id,
      page: 1,
      status: 1
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        deal_order_list: data.result
      })
    })
    //已完成的订单
    utils.PostRequest(api_v_url + '/order/dishOrderlist', {
      openid: openid,
      merchant_id: merchant_id,
      page: 1,
      status: 2
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        complete_order_list: data.result
      })
    })

  },
  swichOrderList:function(e){
    var that = this;
    var order_status = e.currentTarget.dataset.order_status
    that.setData({
      order_status:order_status,
    })

  },
  loadMore:function(e){
    var that = this;
    var order_status = that.data.order_status
    if(order_status==0){
      page_all +1;
      page = page_all;
    }else if(order_status==1){
      page_dealing +=1;
      page = page_dealing;
    }else if (order_status==2){
      page_complete +=1;
      page = page_complete;
    }
    //已完成的订单
    utils.PostRequest(api_v_url + '/order/dishOrderlist', {
      openid: openid,
      merchant_id: merchant_id,
      page: page,
      order_status: order_status
    }, (data, headers, cookies, errMsg, statusCode) => {
      if(order_status==0){
        that.setData({
          all_order_list: data.result
        })
      }else if(order_status==1){
        that.setData({
          deal_order_list: data.result
        })
      }else if(order_status==3){
        that.setData({
          complete_order_list:data.result
        })
      }
      
    })
  },
  /**
   * 处理订单
   */
  deal_order:function(e){
    var order_id = e.currentTarget.dataset.order_id;
    utils.PostRequest(api_v_url + '/aa/bb', {
      order_id:order_id,
      merchant_id: merchant_id,
    }, (data, headers, cookies, errMsg, statusCode) => {
      //处理订单的状态改变
      /**
       *   逻辑需要写
       */
      app.showToast('处理成功');
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