// pages/hotel/order/goods_list.js
/**
 * 商城订单列表页面
 */
const app = getApp()
const mta = require('../../../utils/mta_analysis.js')
const utils = require('../../../utils/util.js')
var api_url = app.globalData.api_url;
var api_v_url = app.globalData.api_v_url;
var cache_key = app.globalData.cache_key;
var merchant_id;
var openid;
var type;
var page_all = 1;      //全部订单
var page_dealing = 1;  //待处理
var page_ship = 1;     //待发货
var page_complete = 1; //已完成

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 'all'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    openid = options.openid
    merchant_id = options.merchant_id;
    type = options.type;
    that.getOrderList(openid,merchant_id,0,1);
    that.getOrderList(openid, merchant_id, 1, 1);
    that.getOrderList(openid, merchant_id, 2, 1);
    that.getOrderList(openid, merchant_id, 3, 1);


  },
  getOrderList:function(openid,merchant_id,order_status,page){
    var that = this;
    utils.PostRequest(api_v_url + '/order/orderlist', {
      openid: openid,
      merchant_id: merchant_id,
      page: 1,
      status: order_status,
      type, type
    }, (data, headers, cookies, errMsg, statusCode) => {
      if(order_status==0){
        that.setData({
          all_order_list: data.result.datalist
        })
      }else if(order_status==1){
        that.setData({
          deal_order_list: data.result.datalist
        })
      }else if(order_status==2){
        that.setData({
          ship_order_list: data.result.datalist
        })
      }else if(order_status==3){
        that.setData({
          complete_order_list: data.result.datalist
        })
      }
      
    })
  },
  loadMore:function(e){
    var that = this;
    var order_status = that.data.order_status
    if (order_status == 0) {
      page_all += 1;
      page = page_all;
    } else if (order_status == 1) {
      page_dealing += 1;
      page = page_dealing;
    }else if(order_status==3){
      page_ship +=1;
      page = page_ship;
    }else if (order_status == 3) {
      page_complete += 1;
      page = page_complete;
    }
    that.getOrderList(openid,merchant_id,order_status,page);
  },
  //接单
  orderReceive:function(e){
    
  },
  //发货
  onShip:function(e){
    var order_id = e.currentTarget.dataset.order_id;
    wx.navigateTo({
      url: '/pages/hotel/order/goods_tracking_number?order_id'+order_id,
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
    var that = this;
    that.getOrderList(openid, merchant_id, 0, page_all);
    that.getOrderList(openid, merchant_id, 1, page_dealing);
    that.getOrderList(openid, merchant_id, 2, page_ship);
    that.getOrderList(openid, merchant_id, 3, page_complete);
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


  // 选项卡选择
  showTab: function (e) {
    let self = this;
    let tabType = e.currentTarget.dataset.tab;
    self.setData({
      tab: tabType
    });
  }
})