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
var page_dealing = 1;
var page_complete = 1;
var type;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedTab: 'all',
    order_status: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    openid = options.openid
    merchant_id = options.merchant_id;
    var order_status = options.order_status
    type = options.type;
    that.setData({
      order_status: order_status,
      type: type
    })


    //全部订单
    utils.PostRequest(api_v_url + '/order/orderlist', {
      openid: openid,
      merchant_id: merchant_id,
      page: 1,
      status: 0,
      type: type
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        all_order_list: data.result.datalist
      })
    })
    //处理中的订单
    utils.PostRequest(api_v_url + '/order/orderlist', {
      openid: openid,
      merchant_id: merchant_id,
      page: 1,
      status: 1,
      type: type
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        deal_order_list: data.result.datalist
      })
    })
    //已完成的订单
    utils.PostRequest(api_v_url + '/order/orderlist', {
      openid: openid,
      merchant_id: merchant_id,
      page: 1,
      status: 2,
      type: type
    }, (data, headers, cookies, errMsg, statusCode) => {
      that.setData({
        complete_order_list: data.result.datalist
      })
    })

  },
  swichOrderList: function (e) {
    var that = this;
    var order_status = e.currentTarget.dataset.order_status
    that.setData({
      order_status: order_status,
    })

  },
  loadMore: function (e) {
    var that = this;
    var order_status = that.data.order_status
    if (order_status == 0) {
      page_all += 1;
      page = page_all;
    } else if (order_status == 1) {
      page_dealing += 1;
      page = page_dealing;
    } else if (order_status == 2) {
      page_complete += 1;
      page = page_complete;
    }
    //已完成的订单
    utils.PostRequest(api_v_url + '/order/orderlist', {
      openid: openid,
      merchant_id: merchant_id,
      page: page,
      status: order_status,
      type: type
    }, (data, headers, cookies, errMsg, statusCode) => {
      if (order_status == 0) {
        that.setData({
          all_order_list: data.result.datalist
        })
      } else if (order_status == 1) {
        that.setData({
          deal_order_list: data.result.datalist
        })
      } else if (order_status == 3) {
        that.setData({
          complete_order_list: data.result.datalist
        })
      }

    })
  },
  /**
   * 接单不接单
   */
  orderReceive:function(e){
    var that = this;
    var order_id = e.currentTarget.dataset.order_id;
    var keys = e.currentTarget.dataset.keys;
    var order_status = that.data.order_status 
    var user_info = wx.getStorageSync(cache_key + 'userinfo');
    var action = e.currentTarget.dataset.action;
    var delivery_type = e.currentTarget.dataset.delivery_type;
    //console.log(e);
    //return false;
    if(action==1){
      var msg ='确认接单';
    }else if(action==2){
      var msg = '确认不接单';
    }
    wx.showModal({
      title: '提示',
      content: msg,
      success:function(res){
        if (res.confirm) {
          utils.PostRequest(api_v_url + '/order/orderReceive', {
            action: action,
            openid: user_info.openid,
            order_id: order_id
          }, (data, headers, cookies, errMsg, statusCode) => {
            app.showToast('操作成功');
            if(order_status==0){//全部订单
              var order_list = that.data.all_order_list
              if(action==2){
                
                order_list.splice(keys, 1)
                
              }else if(action==1){
                if (delivery_type==1){
                  order_list[keys].status = 14;
                  order_list[keys].status_str = '待骑手接单';
                }else {
                  order_list.splice(keys, 1)
                }
                
              }
              that.setData({
                all_order_list: order_list
              })
            }else if(order_status==1){//待处理订单
              var order_list = that.data.deal_order_list;
              if(action==2){
                
                order_list.splice(keys, 1)
                
              }else if(action==1){
                if(delivery_type==1){
                  order_list[keys].status = 14;
                  order_list[keys].status_str = '待骑手接单';
                }else {
                  order_list.splice(keys, 1)
                }
                
              }
              that.setData({
                deal_order_list: order_list
              })
            }
            
            //已完成的订单
            that.getOrderList(2);
            
            
          })
        }
      }
    })
  },
  getOrderList:function(status){
    var that = this;
    utils.PostRequest(api_v_url + '/order/orderlist', {
      openid: openid,
      merchant_id: merchant_id,
      page: page_complete,
      status: status,
      type: type
    }, (data, headers, cookies, errMsg, statusCode) => {
      if(status==0){
        that.setData({
          all_order_list: data.result.datalist
        })
      }else if(status==1){
        that.setData({
          deal_order_list: data.result.datalist
        })
      }else if(status==2){
        that.setData({
          complete_order_list: data.result.datalist
        })
      }
      

    })
  },
  /**
   * 处理订单
   */
  deal_order: function (e) {
    var that = this;
    var order_id = e.currentTarget.dataset.order_id;
    var keys = e.currentTarget.dataset.keys;
    var order_status = that.data.order_status 
    var user_info = wx.getStorageSync(cache_key + 'userinfo');

    wx.showModal({
      title: '提示',
      content: '确认处理该订单?',
      success: function (res) {
        if (res.confirm) {
          utils.PostRequest(api_v_url + '/order/orderProcess', {
            order_id: order_id,
            openid: user_info.openid,
          }, (data, headers, cookies, errMsg, statusCode) => {
            //处理订单的状态改变
            /**
             *   逻辑需要写
             */
            if (order_status == 0) {
              var all_order_list = that.data.all_order_list
              all_order_list[keys].status = 2;
              that.setData({
                all_order_list: all_order_list
              })

              //处理中的订单
              utils.PostRequest(api_v_url + '/order/orderlist', {
                openid: openid,
                merchant_id: merchant_id,
                page: page_dealing,
                status: 1,
                type: type
              }, (data, headers, cookies, errMsg, statusCode) => {
                that.setData({
                  deal_order_list: data.result.datalist
                })
              })
              //已完成的订单
              utils.PostRequest(api_v_url + '/order/orderlist', {
                openid: openid,
                merchant_id: merchant_id,
                page: page_complete,
                status: 2,
                type: type
              }, (data, headers, cookies, errMsg, statusCode) => {
                that.setData({
                  complete_order_list: data.result.datalist
                })
              })

            } else if (order_status == 1) {
              var deal_order_list = that.data.deal_order_list
              deal_order_list.splice(keys, 1);
              that.setData({
                deal_order_list: deal_order_list
              })
            }
            app.showToast('处理成功');

            //全部订单
            utils.PostRequest(api_v_url + '/order/orderlist', {
              openid: openid,
              merchant_id: merchant_id,
              page: page_all,
              status: 0,
              type: type
            }, (data, headers, cookies, errMsg, statusCode) => {
              that.setData({
                all_order_list: data.result.datalist
              })
            })

            //已完成的订单
            utils.PostRequest(api_v_url + '/order/orderlist', {
              openid: openid,
              merchant_id: merchant_id,
              page: page_complete,
              status: 2,
              type: type
            }, (data, headers, cookies, errMsg, statusCode) => {
              that.setData({
                complete_order_list: data.result.datalist
              })
            })
            mta.Event.stat('completeOrder', { 'openid': openid,'merchantid':merchant_id })
          })
        }
      }
    })
  },
  /**
   * 拨打订餐电话
   */
  phonecallevent: function (e) {
    var tel = e.target.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })

  },
  gotoOrderDetail: function (e) {
    var order_id = e.currentTarget.dataset.order_id;
    wx.navigateTo({
      url: '/pages/hotel/order/detail?openid=' + openid + '&order_id=' + order_id,
    })
  },
  gotoDishDetail: function (e) {
    var goods_id = e.currentTarget.dataset.goods_id;
    wx.navigateTo({
      url: '/pages/hotel/dishes/detail?goods_id=' + goods_id,
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

  },
  switchTab: function (e) {
    let self = this;
    let selectedTab = e.currentTarget.dataset.tab;
    self.setData({ selectedTab: selectedTab });
  }
})